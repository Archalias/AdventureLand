import { sortInventory, scrambleInventory } from '../functions/inventory.js';

import inventorySortButton from './inventorySortButtonTemplate.html';

(() => {
  const { $ } = parent;
  let state = {
    sorting: false,
  };

  // State based interface initializations
  if ($('#bottomleftcorner').find('[class$=theinventory]').length) {
    if (!$('#arc_b_isort').length) addInventorySortButton();
  }

  // Register listener to cleanup when script terminates
  window.addEventListener('unload', cleanup);

  // Create a backup of original function persisted in parent
  if (!parent.renderInventory) parent.renderInventory = parent.render_inventory;
  // Extend original render_inventory() function
  parent.render_inventory = (m) => {
    parent.renderInventory(m);
    if (!m) addInventorySortButton();
  };

  // Functions
  function toggleAnalytics() {
    showAnalytics = !showAnalytics;
    if (showAnalytics) {
      $('[id^=arc_meters]').show();
    } else {
      $('[id^=arc_meters]').hide();
    }
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
    $('#arc_b_isort').remove();
    // Restore base functions
    if (parent.renderInventory) parent.render_inventory = parent.renderInventory;
  }
})();