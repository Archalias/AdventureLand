import { sortInventory, scrambleInventory } from '../functions/inventory.js';

import analyticsButton from './analyticsTemplate.html';
import inventorySortButton from './inventorySortButtonTemplate.html';
import statsHtml from './statsTemplate.html';

((parent) => {
  const { $, socket, entities } = parent;
  let state = {
    sorting: false,
  };
  let combatLog = [];
  let lootLog = [];

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
      xp: data.kill && (entities[data.id]?.xp || 0),
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

  // Add interface elements
  $('#newparty').before(statsHtml);
  $('#toprightcorner').find('span.codebuttons').after(analyticsButton);
  // Setup interface events
  $('#analyticsbutton').click(toggleAnalytics);

  // State based interface initializations
  if (!parent.showAnalytics) $('[id^=analyticsmeters]').hide();
  if ($('#bottomleftcorner').find('[class$=theinventory]').length) {
    if (!$('#inventorysortb').length) addInventorySortButton();
  }

  // Interval for log parsing/meters
  parent.dpsInterval = setInterval(() => {
    if (!parent.showAnalytics) return;
    const currentTime = Date.now();
    const targetTime = currentTime - 300000;

    combatLog = combatLog.filter(({ time }) => time > targetTime);
    lootLog = lootLog.filter(({ time }) => time > targetTime);

    parent.dps = 0;

    const players = parent.party_list.length ? [...parent.party_list] : [parent.character.name];
    players.forEach(player => {
      const log = combatLog.filter(({ hid }) => hid === player);
      // Calculate dps for last 60 seconds
      let dps = log.reduce((totalDamage, { damage }) => totalDamage + (damage || 0), 0);
      let hps = log.reduce((totalHeal, { heal, lifesteal }) => totalHeal + (heal || 0) + (lifesteal || 0), 0);
      // Limit dps meter to oldest entry
      const firstLogTime = currentTime - log.reduce((oldestTime, { time }) => time < oldestTime ? time : oldestTime, currentTime);
      dps = Math.round(dps / (firstLogTime / 1000));
      hps = Math.round(hps / (firstLogTime / 1000));
      parent.dps += dps;
      $(`#dps_${player}`).text(`${to_pretty_num(dps || 0)}`);
      $(`#hps_${player}`).text(`${to_pretty_num(hps || 0)}`);
    });
    const log = combatLog.filter(({ hid }) => parent.party_list.some(player => player === hid));
    // Limit meters to oldest entry
    const firstLogTime = currentTime - log.reduce((oldestTime, { time }) => time < oldestTime ? time : oldestTime, currentTime);
    let xph = log.reduce((totalXp, { xp }) => totalXp + (xp ? xp : 0), 0);
    xph = Math.round(xph * (1 / (firstLogTime / 3600000)));
    let gph = lootLog.reduce((totalGold, { gold }) => totalGold + (gold || 0), 0);
    gph = Math.round(gph * (1 / (firstLogTime / 3600000)));

    $(`#stats_xph`).text(`${to_pretty_num(xph || 0)}`);
    $(`#stats_dps`).text(`${parent.to_pretty_num(parent.dps || 0)}`);
    $(`#stats_gph`).text(`${to_pretty_num(gph || 0)}`);
  }, 250);

  // Functions
  function toggleAnalytics() {
    parent.showAnalytics = !parent.showAnalytics;
    if (parent.showAnalytics) {
      $('[id^=analyticsmeters]').show();
    } else {
      $('[id^=analyticsmeters]').hide();
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
            <div id="analyticsmeters" style="position: absolute; margin: -24px 0px 0px 0px">
              <div id="dps_${player}" style="background: black; border: 4px solid gray; width: 52px; margin-bottom: 2px;padding: 2px; display: block; text-align: left;">0</div>
              <div id="hps_${player}" style="color: #FF2E46; background: black; border: 4px solid gray; width: 52px; margin-bottom: 2px; margin-top: -6px; padding: 2px; display: block; text-align: left;">0</div>
            </div>
          `);
        }
      }
    });
    if (!parent.showAnalytics) $('[id^=analyticsmeters]').hide();
  }

  function addInventorySortButton() {
    // Inventory sort button
    $('[class$=theinventory]').find('[class=goldnum]').parent().before(inventorySortButton);
    $('#inventorysortb').hover(
      () => { $('#inventorysortb').css({ 'background-color': 'gray', 'border-color': 'lightgray' }); },
      () => { $('#inventorysortb').css({ 'background-color': '', 'border-color': '' }); }
    );
    $('#inventorysortb').click(() => {
      if (state.sorting) return -1;
      state.sorting = true;
      let totalSwaps = sortInventory();
      let animateSortIcon = setInterval(() => {
        $('#inventorysortb').text(['-', '\\', '|', '/'][Math.floor((Date.now() % 500) / 125)]);
      }, 25);
      setTimeout(() => {
        state.sorting = false;
        clearInterval(animateSortIcon);
        $('#inventorysortb').text('⇅');
      }, 25 * totalSwaps + 500);
    });
    $('#inventorysortb').mousedown((event) => event.which === 3 && (() => {
      if (state.sorting) return -1;
      state.sorting = true;
      let totalSwaps = scrambleInventory();
      let animateSortIcon = setInterval(() => {
        $('#inventorysortb').text(['-', '\\', '|', '/'][Math.floor((Date.now() % 500) / 125)]);
      }, 25);
      setTimeout(() => {
        state.sorting = false;
        clearInterval(animateSortIcon);
        $('#inventorysortb').text('⇅');
      }, 25 * totalSwaps + 500);
    })());
  }

  function cleanup() {
    // Clean up interface
    $('#analyticsbutton').remove();
    $('#chancefulldiv').remove();
    $('[id^=partyframe_]').remove();
    $('[id^=analyticsmeters]').remove();
    $('#inventorysortb').remove();
    // Deregister sockets
    if (parent.combatLogSocket) socket.off(...parent.combatLogSocket);
    if (parent.chestLootSocket) socket.off(...parent.chestLootSocket);
    // Clear intervals
    if (parent.dpsInterval) clearInterval(parent.dpsInterval);
    // Restore base functions
    if (parent.renderInventory) parent.render_inventory = parent.renderInventory;
  }
})(parent);