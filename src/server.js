const express = require("express");
const bodyParser = require("body-parser");
const PdfPrinter = require("pdfmake");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const suffix = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `${day}${suffix(day)} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
}

app.post("/generate-pdf", (req, res) => {
  const { arr } = req.body;

  if (!Array.isArray(arr)) {
    return res.status(400).json({ error: "Invalid array input." });
  }

  let content = [];

  arr.forEach((slip, index) => {
    content.push(
      { text: slip.companyName, style: "header", alignment: "center" },
      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              {
                text: `${slip.type} : ${slip.id}`,
                style: "subheader",
                alignment: "left",
              },
              {
                text: `Date: ${formatDate(slip.date)}`,
                style: "subheader",
                alignment: "right",
              },
            ],
          ],
        },
        layout: {
          hLineWidth: (i, node) =>
            i === 0 || i === node.table.body.length ? 1 : 0,
          hLineColor: () => "#ccc",
          vLineWidth: () => 0,
        },
        margin: [0, 30, 0, 10],
      },
      {
        table: {
          widths: ["auto", "*"],
          body: Object.entries(slip.listData).map(([label, val]) => {
            return [{ text: label, bold: true }, " :  " + val];
          }),
        },
        layout: "noBorders",
        margin: [0, 10],
      },
      { text: "", pageBreak: index < arr.length - 1 ? "after" : undefined }
    );
  });

  const docDefinition = {
    content,
    styles: {
      header: { fontSize: 16, bold: true, margin: [0, 10] },
      subheader: { fontSize: 14, margin: [0, 5] },
    },
    defaultStyle: {
      font: "Helvetica",
    },
    pageMargins: [80, 40, 80, 40],
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];
  pdfDoc.on("data", (chunk) => chunks.push(chunk));
  pdfDoc.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    const today = formatDate(new Date()).replace(/\s/g, "-");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=workslip-${today}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  });
  pdfDoc.end();
});

app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});
