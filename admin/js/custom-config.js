// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Configuración OverlayScrollbars para sidebar
  const sidebarWrapper = document.querySelector('.sidebar-wrapper');
  if (sidebarWrapper && OverlayScrollbarsGlobal?.OverlayScrollbars) {
    OverlayScrollbarsGlobal.OverlayScrollbars(sidebarWrapper, {
      scrollbars: {
        theme: 'os-theme-light',
        autoHide: 'leave',
        clickScroll: true,
      },
    });
  }

  // Configuración SortableJS para elementos con clase connectedSortable
  const connectedSortable = document.querySelector('.connectedSortable');
  if (connectedSortable) {
    new Sortable(connectedSortable, {
      group: 'shared',
      handle: '.card-header',
    });

    connectedSortable.querySelectorAll('.card-header').forEach(header => {
      header.style.cursor = 'move';
    });
  }

  // Inicialización ApexCharts (ejemplo gráfico de ventas)
  const salesChartOptions = {
    series: [
      { name: 'Digital Goods', data: [28, 48, 40, 19, 86, 27, 90] },
      { name: 'Electronics', data: [65, 59, 80, 81, 56, 55, 40] },
    ],
    chart: {
      height: 300,
      type: 'area',
      toolbar: { show: false },
    },
    legend: { show: false },
    colors: ['#0d6efd', '#20c997'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      type: 'datetime',
      categories: [
        '2023-01-01', '2023-02-01', '2023-03-01',
        '2023-04-01', '2023-05-01', '2023-06-01', '2023-07-01',
      ],
    },
    tooltip: { x: { format: 'MMMM yyyy' } },
  };

  const salesChartElement = document.querySelector('#revenue-chart');
  if (salesChartElement) {
    const salesChart = new ApexCharts(salesChartElement, salesChartOptions);
    salesChart.render();
  }

  // Inicialización jsVectorMap para mapa mundial
  const worldMapElement = document.querySelector('#world-map');
  if (worldMapElement) {
    new jsVectorMap({
      selector: '#world-map',
      map: 'world',
    });
  }

  // Inicialización de sparklines (gráficos pequeños)
  const sparklineOptions = (data) => ({
    series: [{ data }],
    chart: { type: 'area', height: 50, sparkline: { enabled: true } },
    stroke: { curve: 'straight' },
    fill: { opacity: 0.3 },
    yaxis: { min: 0 },
    colors: ['#DCE6EC'],
  });

  const sparkline1El = document.querySelector('#sparkline-1');
  if (sparkline1El) {
    new ApexCharts(sparkline1El, sparklineOptions([1000, 1200, 920, 927, 931, 1027, 819, 930, 1021])).render();
  }

  const sparkline2El = document.querySelector('#sparkline-2');
  if (sparkline2El) {
    new ApexCharts(sparkline2El, sparklineOptions([515, 519, 520, 522, 652, 810, 370, 627, 319, 630, 921])).render();
  }

  const sparkline3El = document.querySelector('#sparkline-3');
  if (sparkline3El) {
    new ApexCharts(sparkline3El, sparklineOptions([15, 19, 20, 22, 33, 27, 31, 27, 19, 30, 21])).render();
  }
});

/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


