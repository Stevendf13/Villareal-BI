google.charts.load('current', { packages: ['corechart'] });

let arregloDatos = [];

function agregarDato(prestablecidoLeyenda = "", prestablecidoValor = "") {
    const datos = document.getElementById("datos");
    const cantidad = datos.getElementsByClassName("dato").length + 1;

    const dato = document.createElement("div");
    dato.className = "dato";

    const inputLeyenda = document.createElement("input");
    inputLeyenda.type = "text";
    inputLeyenda.className = "serie";
    inputLeyenda.placeholder = prestablecidoLeyenda;
    dato.appendChild(inputLeyenda);

    const inputValor = document.createElement("input");
    inputValor.type = "text"; // Permitir porcentajes o números
    inputValor.className = "valor";
    inputValor.placeholder = prestablecidoValor;
    dato.appendChild(inputValor);

    datos.appendChild(dato);
}

function setDefaultParameters() {
    const tipo = document.getElementById("tipo").value;
    const datosContainer = document.getElementById("datos");
    datosContainer.innerHTML = ''; // Limpiar los datos anteriores.

    // Textos guía según el gráfico seleccionado.
    switch (tipo) {
        case 'barras-roi':
            document.getElementById("titulo").value = "ROI por Campaña";
            agregarDato("Eje X (Campañas)", "Eje Y (ROI)");
            break;
        case 'linea-evolucion-matriculas':
            document.getElementById("titulo").value = "Evolución de Matrículas";
            agregarDato("Eje X (Meses)", "Eje Y (Matrículas)");
            break;
        case 'pastel-gastos-publicidad':
            document.getElementById("titulo").value = "Distribución de Gastos en Publicidad";
            agregarDato("Categoría", "Porcentaje");
            break;
        case 'dispersion-inversion-matriculas':
            document.getElementById("titulo").value = "Relación entre Inversión y Matrículas";
            agregarDato("Eje X (Inversión en Soles)", "Eje Y (Matrículas)");
            break;
        case 'area-crecimiento-matriculas':
            document.getElementById("titulo").value = "Crecimiento de Matrículas por Año";
            agregarDato("Eje X (Años)", "Eje Y (Matrículas acumuladas)");
            break;
        case 'histograma-edad-estudiantes':
            document.getElementById("titulo").value = "Distribución de Edad de Estudiantes";
            agregarDato("Intervalo de Edad", "Frecuencia");
            break;
    }
}

function drawChart() {
    const datos = document.getElementById("datos").getElementsByClassName("dato");
    arregloDatos = [['Categoría', 'Valor']];

    for (let i = 0; i < datos.length; i++) {
        const categoria = datos[i].querySelector(".serie").value;
        let valor = datos[i].querySelector(".valor").value;

        // Convertir porcentaje a decimal si es necesario
        if (valor.includes('%')) {
            valor = parseFloat(valor.replace('%', '')) / 100;
        } else {
            valor = parseFloat(valor);
        }

        if (!categoria || isNaN(valor)) {
            alert("Complete todos los campos correctamente.");
            return;
        }

        arregloDatos.push([categoria, valor]);
    }

    const data = google.visualization.arrayToDataTable(arregloDatos);
    const options = { title: document.getElementById("titulo").value, width: 600, height: 400 };

    const tipo = document.getElementById("tipo").value;
    const chartContainer = document.getElementById("piechart");

    let chart;
    switch (tipo) {
        case 'barras-roi':
            chart = new google.visualization.BarChart(chartContainer);
            break;
        case 'linea-evolucion-matriculas':
            chart = new google.visualization.LineChart(chartContainer);
            break;
        case 'pastel-gastos-publicidad':
            chart = new google.visualization.PieChart(chartContainer);
            break;
        case 'dispersion-inversion-matriculas':
            chart = new google.visualization.ScatterChart(chartContainer);
            break;
        case 'area-crecimiento-matriculas':
            chart = new google.visualization.AreaChart(chartContainer);
            break;
        case 'histograma-edad-estudiantes':
            chart = new google.visualization.Histogram(chartContainer);
            break;
    }
    chart.draw(data, options);
}

function exportarImagen() {
    const elemento = document.getElementById('piechart');
    html2canvas(elemento).then(canvas => {
        const link = document.createElement('a');
        link.download = 'grafico.png';
        link.href = canvas.toDataURL();
        link.click();
    }).catch(error => {
        console.error("Error al exportar el gráfico:", error);
    });
}
