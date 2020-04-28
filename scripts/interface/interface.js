import { sortInventory, scrambleInventory } from '../functions/inventory.js';

import analyticsButton from './analyticsTemplate.html';
import inventorySortButton from './inventorySortButtonTemplate.html';
import statsHtml from './statsTemplate.html';

(() => {
  const { $, socket } = parent;
  let state = {
    sorting: false,
  };
  let combatLog = [];
  let lootLog = [];
  let showAnalytics = true;

  // Add interface elements
  $('#newparty').before(statsHtml);
  $('#toprightcorner').find('span.codebuttons').after(analyticsButton);
  // Setup interface events
  $('#arc_b_analytics').click(toggleAnalytics);

  // State based interface initializations
  if (!showAnalytics) $('[id^=arc_meters]').hide();
  if ($('#bottomleftcorner').find('[class$=theinventory]').length) {
    if (!$('#arc_b_isort').length) addInventorySortButton();
  }

  // Register listener to cleanup when script terminates
  window.addEventListener('unload', cleanup);
  // Create a backup of original function persisted in parent
  if (!parent.renderParty) parent.renderParty = parent.render_party;
  // Extend original render_party() function
  parent.render_party = () => {
    parent.renderParty();
    addPartyStats();
  };
  parent.render_party();

  // Create a backup of original function persisted in parent
  if (!parent.renderInventory) parent.renderInventory = parent.render_inventory;
  // Extend original render_inventory() function
  parent.render_inventory = (m) => {
    parent.renderInventory(m);
    if (!m) addInventorySortButton();
  };

  // Register combat log socket
  parent.combatLogSocket = [
    'hit',
    (data) => combatLog.push({
      ...data,
      xp: data.kill && (parent.entities[data.id]?.xp || 0),
      time: Date.now()
    }),
  ];
  socket.on(...parent.combatLogSocket);

  // Register chest loot socket
  parent.chestLootSocket = [
    'chest_opened',
    (data) => lootLog.push({ time: Date.now(), gold: data.gold }),
  ];
  socket.on(...parent.chestLootSocket);


  // Interval for log parsing/meters
  let dpsInterval = setInterval(calculateStats, 250);

  function calculateStats() {
    if (!showAnalytics) return;
    const targetTime = Date.now() - 300000;

    combatLog = combatLog.filter(({ time }) => time > targetTime);
    lootLog = lootLog.filter(({ time }) => time > targetTime);

    let totals = {
      xp: 0,
      dps: 0,
      first: Date.now(),
    };

    const players = parent.party_list.length ? [...parent.party_list] : [character.name];
    players.forEach(player => {
      // Calculate metrics for last 60 seconds, why parse this every single loop....
      let metrics = combatLog.reduce((total, { hid, time, xp, damage, heal, lifesteal }) => {
        if (hid === player) {
          total.dps += (damage || 0);
          total.hps += (heal || 0) + (lifesteal || 0);
          total.xp += (xp || 0);
          if (time < total.first) total.first = time;
        }
        return total;
      }, { dps: 0, hps: 0, xp: 0, first: Date.now() });
      if (metrics.first < totals.first) totals.first = metrics.first;
      metrics.first = (Date.now() - metrics.first) / 1000;
      // Limit dps meter to oldest entry
      metrics.dps = Math.round(metrics.dps / metrics.first);
      metrics.hps = Math.round(metrics.hps / metrics.first);
      totals.dps += metrics.dps || 0;
      totals.xp += metrics.xp || 0;
      $(`#dps_${player}`).text(`${metrics.dps || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $(`#hps_${player}`).text(`${metrics.hps || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    totals.first = (Date.now() - totals.first) / 1000;

    let xph = Math.round(totals.xp * (1 / (totals.first / 3600)));
    let gph = lootLog.reduce((totalGold, { gold }) => totalGold + (gold || 0), 0);
    gph = Math.round(gph * (1 / (totals.first / 3600)));

    $(`#stats_xph`).text(`${xph || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $(`#stats_dps`).text(`${totals.dps || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $(`#stats_gph`).text(`${gph || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }
  // Functions
  function toggleAnalytics() {
    showAnalytics = !showAnalytics;
    if (showAnalytics) {
      $('[id^=arc_meters]').show();
    } else {
      $('[id^=arc_meters]').hide();
    }
  }

  function addPartyStats() {
    parent.party_list.forEach(player => {
      let playerDiv = $(`[onclick$=\\(\\"${player}\\"\\)]`);
      // Create the player meters if necessary
      if (playerDiv.length) {
        if (!playerDiv.find(`[id^=partyframe_${player}]`).length) {
          playerDiv.wrap(`<div id="partyframe_${player}" style="display: inline-block; margin-right: 4px;"></div>`);
          playerDiv.after(`
            <div id="arc_meters" style="position: absolute; margin: -24px 0px 0px 0px">
              <div id="dps_${player}" style="background: black; border: 4px solid gray; width: 52px; margin-bottom: 2px;padding: 2px; display: block; text-align: left;">0</div>
              <div id="hps_${player}" style="color: #FF2E46; background: black; border: 4px solid gray; width: 52px; margin-bottom: 2px; margin-top: -6px; padding: 2px; display: block; text-align: left;">0</div>
            </div>
          `);
        }
      }
    });
    calculateStats();
    if (!showAnalytics) $('[id^=arc_meters]').hide();
  }

  function addInventorySortButton() {
    // Inventory sort button
    $('[class$=theinventory]').find('[class=goldnum]').parent().before(inventorySortButton);
    $('#arc_b_isort').hover(
      () => { $('#arc_b_isort').css({ 'background-color': 'gray', 'border-color': 'lightgray' }); },
      () => { $('#arc_b_isort').css({ 'background-color': '', 'border-color': '' }); }
    );
    $('#arc_b_isort').click(() => {
      if (state.sorting) return -1;
      state.sorting = true;
      let totalSwaps = sortInventory();
      let animateSortIcon = setInterval(() => {
        $('#arc_b_isort').text(['-', '\\', '|', '/'][Math.floor((Date.now() % 500) / 125)]);
      }, 25);
      setTimeout(() => {
        state.sorting = false;
        clearInterval(animateSortIcon);
        $('#arc_b_isort').text('⇅');
      }, 25 * totalSwaps + 500);
    });
    $('#arc_b_isort').mousedown((event) => event.which === 3 && (() => {
      if (state.sorting) return -1;
      state.sorting = true;
      let totalSwaps = scrambleInventory();
      let animateSortIcon = setInterval(() => {
        $('#arc_b_isort').text(['-', '\\', '|', '/'][Math.floor((Date.now() % 500) / 125)]);
      }, 25);
      setTimeout(() => {
        state.sorting = false;
        clearInterval(animateSortIcon);
        $('#arc_b_isort').text('⇅');
      }, 25 * totalSwaps + 500);
    })());
  }

  function cleanup() {
    // Clean up interface
    $('#arc_b_analytics').remove();
    $('#chancefulldiv').remove();
    $('[id^=partyframe_]').remove();
    $('[id^=arc_meters]').remove();
    $('#arc_b_isort').remove();
    // Deregister sockets
    if (parent.combatLogSocket) socket.off(...parent.combatLogSocket);
    if (parent.chestLootSocket) socket.off(...parent.chestLootSocket);
    // Clear intervals
    if (dpsInterval) clearInterval(dpsInterval);
    // Restore base functions
    if (parent.renderInventory) parent.render_inventory = parent.renderInventory;
    if (parent.renderParty) parent.render_party = parent.renderParty;
  }
})();