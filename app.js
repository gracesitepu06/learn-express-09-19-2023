// const http = require("http");

const fs = require("fs");

const express = require("express");
const app = express();

//MIDLEWARE --> express
app.use(express.json()); // memodikasi incoming req, re body ke API

const port = process.env.port || 3000;

// app.get("/", (req, res) => {
//   res.status(400).json({
//     message: "hello fsw2",
//   });
// });

// app.post("/", (req, res) => {
//   res.status(200).json({
//     message: "ini API contoh post",
//   });
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  //   console.log(res.data);
  res.status(200).json({
    status: "success",
    data: {
      tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found`,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour, // Mengirimkan tur yang sesuai sebagai respons, bukan seluruh array tours
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newData = Object.assign(
    {
      id: newId,
    },
    req.body
  );

  tours.push(newData);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 201 -> created
      res.status(201).json({
        status: "succes",
        data: {
          tour: newData,
        },
      });
    }
  );

  //   console.log(req.body);
  //   console.log(req.body.name);
  //   res.send("udah");
});

app.patch("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  // findIndex = -1 (kalau data nya gk ada)
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} this not found`,
    });
  }

  tours[tourIndex] = { ...tours[tourIndex], ...req.body };

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `tour with this id ${id} edited`,
        data: {
          tour: tours[tourIndex],
        },
      });
    }
  );
});

app.delete("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  // cari index sesuai id
  const tourIndex = tours.findIndex((el) => el.id === id);

  // validasi kalau data yg sesuai req.params.id tdk ada
  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: "data not found",
    });
  }

  // proses menghapus data sesuai id/ index dari req.param.id
  tours.splice(tourIndex, 1);
  // proses update di file jsonnya
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil delete data",
        data: null,
      });
    }
  );
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
