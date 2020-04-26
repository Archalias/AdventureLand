((parent) => {
  // An attempt to add valuable interface elements and remove less useful ones
  const { $, socket, entities } = parent;
  let state = {
    sorting: false,
  };

  let combatLog = [];
  let lootLog = [];

  // Clean up any old elements
  $('#analyticsbutton').remove();
  $('#chancefulldiv').remove();
  $('[id^=partyframe_]').remove();
  $('[id^=analyticsmeters]').remove();
  $('#inventorysortb').remove();
  //
  const analyticsButton = `
    <div id="analyticsbutton" class="gamebutton analytics" style="display: inline-block; margin-right: 5px;" onclick="">
      $
    </div>
  `;

  // const chanceHtml = `
  // <div id="chancefulldiv" class="enableclicks" style="background-color: black; font-size: 24px; width: 50px; border: 2px solid gray; line-height: 16px; text-align: right; padding: 2px; color: #299C4C">
  //   <div id="chancetext">%69.69</div>
  // </div>
  // `;

  const statsHtml = `
  <div id="analyticsmeters" style="display: inline-block; margin-right: 4px;">
    <div id="stats_xph" style="color: #5DAC40; background: black; border: 2px solid gray; width: 56px; margin-bottom: 4px;padding: 2px; display: block; text-align: left;">
    0
    </div>
    <div id="stats_dps" style="background: black; border: 2px solid gray; width: 56px; margin-bottom: 4px;padding: 2px; display: block; text-align: left;">
    0
    </div>
    <div id="stats_gph" style="color: gold; background: black; border: 2px solid gray; width: 56px; margin-bottom: 4px;padding: 2px; display: block; text-align: left;">
    0
    </div>
  </div>
  `;

  function addPartyStats() {
    console.log('adding party stats', parent.party_list);
    parent.party_list.forEach(player => {
      let playerDiv = $(`[onclick$=\\(\\"${player}\\"\\)]`);
      // Create the player meters if necessary
      if (playerDiv.length) {
        if (!playerDiv.find(`[id^=partyframe_${player}]`).length) {
          playerDiv.wrap(`<div id="partyframe_${player}" style="display: inline-block; margin-right: 4px;"></div>`);
          // playerDiv.before(`
          //   <div id="analyticsmeters" style="">
          //     <div id="gph_${player}" style="color: gold; background: black; border: 4px solid gray; width: 52px; margin-bottom: 0px;padding: 2px; display: block; text-align: left;">0</div>
          //     <div id="xph_${player}" style="color: #5DAC40; background: black; border: 4px solid gray; width: 52px; margin-bottom: 0px;padding: 2px; display: block; text-align: left;">0</div>
          //   </div>
          // `);
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

  // Create a backup of original function persisted in parent
  if (!parent.renderParty) parent.renderParty = parent.render_party;
  // Extend original render_party() function
  parent.render_party = () => {
    parent.renderParty();
    addPartyStats();
  }
  parent.render_party();

  const inventorySortButton = `
  <div 
    id="inventorysortb"
    class="gamebutton clickable"
    style="width: 18px; height: 0px; line-height: 4px; margin: 0px 4px 0px 4px; padding: 10px 4px 10px 4px; float: right"
    title="Sort Inventory"
  >
    ⇅
  </div>
  `;

  function addInventorySortButton() {
    // Inventory sort button
    $('[class$=theinventory]').find('[class=goldnum]').parent().before(inventorySortButton);
    $('#inventorysortb').hover(
      () => { $('#inventorysortb').css({ 'background-color': 'gray', 'border-color': 'lightgray' }) },
      () => { $('#inventorysortb').css({ 'background-color': '', 'border-color': '' }) }
    );
    $('#inventorysortb').click(sortInventory);
    $('#inventorysortb').mousedown((event) => event.which === 3 && scrambleInventory());
  }

  if ($('#bottomleftcorner').find('[class$=theinventory]').length) {
    if (!$('#inventorysortb').length) {
      addInventorySortButton();
      console.log('adding inventory sort button');
    }
  }

  // Create a backup of original function persisted in parent
  if (!parent.renderInventory) parent.renderInventory = parent.render_inventory;
  // Extend original render_inventory() function
  parent.render_inventory = (m) => {
    parent.renderInventory(m);
    if (!m) addInventorySortButton();
  };

  // One time adds
  $('#newparty').before(statsHtml);
  $('#toprightcorner').find('span.codebuttons').after(analyticsButton);
  $('#analyticsbutton').click(toggleAnalytics);
  if (!parent.showAnalytics) $('[id^=analyticsmeters]').hide();
  // $('#bottommid').find('#rightcornerui').after(chanceHtml);
  // $('[class$=theinventory]').find('[class=goldnum]').parent().after();



  // Socket data
  if (parent.combatLogSocket) socket.off(parent.combatLogSocket[0], parent.combatLogSocket[1]);
  parent.combatLogSocket = [
    'hit',
    (data) => { combatLog.push({ ...data, xp: data.kill ? (entities[data.id] ? entities[data.id].xp : 0) : 0, time: Date.now() }); },
  ];
  socket.on(parent.combatLogSocket[0], parent.combatLogSocket[1]);

  if (parent.chestLootSocket) socket.off(parent.chestLootSocket[0], parent.chestLootSocket[1]);
  parent.chestLootSocket = [
    'chest_opened',
    (data) => { lootLog.push({ time: Date.now(), gold: data.gold }); },
  ];
  socket.on(parent.chestLootSocket[0], parent.chestLootSocket[1]);

  // Interface elements
  function toggleAnalytics() {
    parent.showAnalytics = !parent.showAnalytics;
    if (parent.showAnalytics) {
      $('[id^=analyticsmeters]').show();
    } else {
      $('[id^=analyticsmeters]').hide();
    }
  }

  if (parent.dpsInterval) clearInterval(parent.dpsInterval);
  // Main loop
  parent.dpsInterval = setInterval(() => {
    // Disable meter while toggled off
    if (!parent.showAnalytics) return;
    const currentTime = Date.now();
    const targetTime = currentTime - 300000;

    // Clear old log entries
    combatLog = combatLog.filter(({ time }) => time > targetTime);
    lootLog = lootLog.filter(({ time }) => time > targetTime);

    parent.dps = 0;

    const players = parent.party_list.length ? [...parent.party_list] : [parent.character.name];
    players.forEach(player => {
      const log = combatLog.filter(({ hid }) => hid === player);
      // Calculate dps for last 60 seconds
      let dps = log.reduce((totalDamage, { damage }) => totalDamage + (damage ? damage : 0), 0);
      let hps = log.reduce((totalHeal, { heal, lifesteal }) => totalHeal + (heal || 0) + (lifesteal || 0), 0);
      // Limit dps meter to oldest entry
      const firstLogTime = currentTime - log.reduce((oldestTime, { time }) => time < oldestTime ? time : oldestTime, currentTime);
      dps = Math.round(dps / (firstLogTime / 1000));
      hps = Math.round(hps / (firstLogTime / 1000));
      parent.dps += dps;
      $(`#dps_${player}`).text(`${dps || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $(`#hps_${player}`).text(`${hps || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    const log = combatLog.filter(({ hid }) => parent.party_list.some(player => player === hid));
    // Limit meters to oldest entry
    const firstLogTime = currentTime - log.reduce((oldestTime, { time }) => time < oldestTime ? time : oldestTime, currentTime);
    let xph = log.reduce((totalXp, { xp }) => totalXp + (xp ? xp : 0), 0);
    xph = Math.round(xph * (1 / (firstLogTime / 3600000)));
    let gph = lootLog.reduce((totalGold, { gold }) => totalGold + (gold || 0), 0);
    gph = Math.round(gph * (1 / (firstLogTime / 3600000)));

    $(`#stats_xph`).text(`${xph || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $(`#stats_dps`).text(`${parent.dps || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $(`#stats_gph`).text(`${gph || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }, 250);


  const priorityList = [/mpot[0-9]/i, /hpot[0-9]/i, 'tracker', /stand[0-9]/i, /scroll[0-9]/i, /cscroll[0-9]/i, /fiery.*/i, 'handofmidas'];

  function sortInventory() {
    const { character } = parent;
    if (state.sorting) return -1;
    let animateSortIcon = setInterval(() => {
      $('#inventorysortb').text(['-', '\\', '|', '/'][Math.floor((Date.now() % 500) / 125)]);
    }, 25);
    state.sorting = true;
    let totalSwaps = 0;
    Object.values(character.items)
      .map((item, index) => ({
        id: item ? item.name : undefined,
        ...item,
        ...(item ? G.items[item.name] : []),
        index,
      }))
      .filter(item => item.name)
      .sort((itemA, itemB) => {
        const listA = priorityList.findIndex(match => match.test ? match.test(itemA.id) : itemA.id === match);
        const listB = priorityList.findIndex(match => match.test ? match.test(itemB.id) : itemB.id === match);
        if (listA >= 0) {
          if (listB >= 0) {
            if (listA < listB) return -1;
            if (listA > listB) return 1;
            return 0;
          }
          return -1;
        }
        if (listB >= 0 && listA === -1) return 1;
        if (itemA.set) {
          if (itemB.set) {
            if (itemA.set < itemB.set) return -1;
            if (itemA.set > itemB.set) return 1;
          } else return -1;
        }
        if (itemB.set && !itemA.set) return 1;
        if (itemA.name < itemB.name) return -1;
        if (itemA.name > itemB.name) return 1;
        if (itemA.level) {
          if (itemB.level) {
            if (itemA.level > itemB.level) return -1;
            if (itemA.level < itemB.level) return 1;
          } else return -1;
        }
        if (itemA.q && itemB.q) {
          if (itemA.q < itemB.q) return -1;
          if (itemA.q > itemB.q) return 1;
        }
        return 0;
      })
      .forEach((item, index, items) => {
        if (item.index !== index) {
          setTimeout((a, b) => {
            parent.socket.emit('imove', { a, b });
          }, 25 * totalSwaps, item.index, index);
          const oldIndex = items.findIndex(item => item.index === index);
          if (oldIndex >= 0) items[oldIndex].index = item.index;
          item.index = index;
          totalSwaps += 1;
        }
      });
    setTimeout(() => {
      state.sorting = false;
      clearInterval(animateSortIcon);
      $('#inventorysortb').text('⇅');
    }, 25 * totalSwaps + 500);
    return totalSwaps;
  }

  function scrambleInventory() {
    let totalSwaps = 0;
    if (state.sorting) return -1;
    let animateSortIcon = setInterval(() => {
      $('#inventorysortb').text(['-', '\\', '|', '/'][Math.floor((Date.now() % 500) / 125)]);
    }, 25);
    state.sorting = true;
    Object.values(character.items)
      .map((item, index) => ({
        ...item,
        index,
      }))
      .filter(item => item.name)
      .forEach((item, index) => {
        setTimeout((a, b) => {
          parent.socket.emit('imove', { a, b });
        }, 25 * totalSwaps, index, getRandomInt(0, character.items.length - 1));
        totalSwaps += 1;
      });
    setTimeout(() => {
      state.sorting = false;
      clearInterval(animateSortIcon);
      $('#inventorysortb').text('⇅');
    }, 25 * totalSwaps + 500);
    return totalSwaps;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

})(parent);