const workslipArray = {
    arr: [
        {
            companyName: "Yousuf AI Hashimi Uniform Manufacturing CO LLC",
            type: "WORKSLIP",
            id: "SFLK234KK",
            date: new Date(),
            listData: {
                "WorkSlip No": "SFLK234KK",
                "Job Order No": "JO-129",
                "Customer Name": "AL Ghrurair Metal Industries",
                "Measurement Name": "Sabil Nodaliya",
                "Employee ID": "86214",
                "Measurement": "23...24...12...56.4...23...12",
                "Iteam/Product": "AG DHM Shirt",
                "Type of Product": "Shirt",
                "Quantity": 4,
                "Notes": "Make it little tight",
            },
        },
        {
            companyName: "Yousuf AI Hashimi Uniform Manufacturing CO LLC",
            type: "WORKSLIP",
            id: "SFLK234KK",
            date: new Date(),
            listData: {
                "WorkSlip No": "SKFGKALDK123",
                "Job Order No": "JO-129",
                "Customer Name": "AL Ghrurair Metal Industries",
                "Measurement Name": "Sabil Nodaliya",
                "Employee ID": "86214",
                Measurement: "23...24...12...56.4...23...12",
                "Iteam/Product": "AG DHM Shirt",
                "Type of Product": "Shirt",
                Quantity: 4,
                Notes: "Make it little tight",
            },
        },
        {
            companyName: "Yousuf AI Hashimi Uniform Manufacturing CO LLC",
            type: "WORKSLIP",
            id: "SFLK234KK",
            date: new Date(),
            listData: {
                "WorkSlip No": "SKFGKALDK123",
                "Job Order No": "JO-129",
                "Customer Name": "AL Ghrurair Metal Industries",
                "Measurement Name": "Sabil Nodaliya",
                "Employee ID": "86214",
                Measurement: "23...24...12...56.4...23...12",
                "Iteam/Product": "AG DHM Shirt",
                "Type of Product": "Shirt",
                Quantity: 4,
                Notes: "Make it little tight",
            },
        },
    ],
};

function generateSlips(arr) {
    const container = document.getElementById("output");
    container.innerHTML = "";

    arr.forEach((data, index) => {
        const slip = document.createElement("div");
        slip.className = "slip-container";

        const dateStr = formatCustomDate(new Date(data.date));

        slip.innerHTML = `
        <div class="slip-companyname">
          ${data.companyName}
          </div>
        <div class="slip-header">
          <div class="slip-title"><div class="slip-type">${data.type}</div> : 
          ${data.id}
          </div>
          <div class="slip-meta">
            <div>Date: ${dateStr}</div>
          </div>
        </div>
        <table class="slip-table">
          ${Object.entries(data.listData)
                .map(
                    ([key, val]) => `
            <tr>
              <td class="label">${key}</td>
              <td>:</td>
              <td>${val}</td>
            </tr>
          `
                )
                .join("")}
        </table>
      `;
        container.appendChild(slip);
    });
}

generateSlips(workslipArray.arr);

document.getElementById("downloadBtn").addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    const filename = `workslips-${today}.pdf`;

    const element = document.getElementById("output");
    const opt = {
        margin: 0.5,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
});

function formatCustomDate(date) {
    const day = date.getDate();
    const suffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${day}${suffix(day)} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    return formattedDate;
  }
  