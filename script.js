const data = [
  { penyakit: "Diare", kasus: 8, laki: 4, perempuan: 4, umur: {"0–9":0,"10–19":0,"20–44":3,"45–54":2,"55–59":1,"60–69":2,"70+":0} },
  { penyakit: "Demam Berdarah (Dengue)", kasus: 11, laki: 7, perempuan: 4, umur: {"0–9":6,"10–19":4,"20–44":1,"45–54":0,"55–59":0,"60–69":0,"70+":0} },
  { penyakit: "Influenza", kasus: 17, laki: 9, perempuan: 8, umur: {"0–9":5,"10–19":0,"20–44":4,"45–54":4,"55–59":2,"60–69":2,"70+":0} },
  { penyakit: "Hipertensi", kasus: 19, laki: 8, perempuan: 11, umur: {"0–9":0,"10–19":0,"20–44":7,"45–54":4,"55–59":4,"60–69":2,"70+":2} },
  { penyakit: "Diabetes Melitus", kasus: 14, laki: 5, perempuan: 9, umur: {"0–9":0,"10–19":0,"20–44":3,"45–54":3,"55–59":2,"60–69":2,"70+":4} }
];

const $ = id => document.getElementById(id);

function render(filter="Semua") {
  const rows = filter === "Semua" ? data : data.filter(x => x.penyakit === filter);
  const total = rows.reduce((s,x)=>s+x.kasus,0);
  const male = rows.reduce((s,x)=>s+x.laki,0);
  const female = rows.reduce((s,x)=>s+x.perempuan,0);
  const top = rows.length ? [...rows].sort((a,b)=>b.kasus-a.kasus)[0] : null;

  $("totalCases").textContent = total;
  $("maleCases").textContent = male;
  $("femaleCases").textContent = female;
  $("topDisease").textContent = top ? top.penyakit : "-";

  $("diseaseChart").innerHTML = makeChart(rows.map(x=>({label:x.penyakit,value:x.kasus})));

  const ageTotals = {};
  rows.forEach(x => Object.entries(x.umur).forEach(([age,n]) => ageTotals[age]=(ageTotals[age]||0)+n));
  $("ageChart").innerHTML = makeChart(Object.entries(ageTotals).map(([label,value])=>({label,value})));

  renderTable(rows);
  $("reportText").textContent = top
    ? `Berdasarkan data yang ditampilkan, terdapat ${total} kasus. Penyakit dengan jumlah kasus tertinggi adalah ${top.penyakit} sebanyak ${top.kasus} kasus. Laki-laki tercatat ${male} kasus dan perempuan ${female} kasus.`
    : "Tidak ada data yang sesuai.";
}

function makeChart(items) {
  const max = Math.max(...items.map(x=>x.value),1);
  return items.map(x => `
    <div class="bar-row">
      <span>${x.label}</span>
      <div class="bar-track"><div class="bar" style="width:${(x.value/max)*100}%"></div></div>
      <b>${x.value}</b>
    </div>`).join("");
}

function renderTable(rows) {
  $("diseaseTable").innerHTML = rows.map((x,i)=>`
    <tr>
      <td>${i+1}</td><td>${x.penyakit}</td><td>${x.kasus}</td>
      <td>${x.laki}</td><td>${x.perempuan}</td>
    </tr>`).join("");
}

data.forEach(x => {
  const option = document.createElement("option");
  option.value = x.penyakit;
  option.textContent = x.penyakit;
  $("diseaseFilter").appendChild(option);
});

$("diseaseFilter").addEventListener("change", e => {
  $("searchInput").value = "";
  render(e.target.value);
});

$("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const rows = data.filter(x => x.penyakit.toLowerCase().includes(q));
  renderTable(rows);
});

render();
