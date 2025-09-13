const { nanoid } = require("nanoid");
const books = require("./books");

function validateBookPayload(payload) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = payload ?? {};

  if (!name || name.trim() === "") {
    return {
      ok: false,
      code: 400,
      msg: "Gagal menambahkan buku. Mohon isi nama buku",
    };
  }
  if (readPage > pageCount) {
    return {
      ok: false,
      code: 400,
      msg: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    };
  }
  return {
    ok: true,
    data: {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    },
  };
}

const addBookHandler = (request, h) => {
  const check = validateBookPayload(request.payload);
  if (!check.ok) {
    return h.response({ status: "fail", message: check.msg }).code(check.code);
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = check.data;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.find((b) => b.id === id);
  if (isSuccess) {
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: { bookId: id },
      })
      .code(201);
  }

  return h
    .response({ status: "error", message: "Buku gagal ditambahkan" })
    .code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filtered = books;

  if (typeof name === "string" && name.trim() !== "") {
    const q = name.toLowerCase();
    filtered = filtered.filter((b) => (b.name || "").toLowerCase().includes(q));
  }

  if (reading === "0" || reading === "1") {
    const val = reading === "1";
    filtered = filtered.filter((b) => b.reading === val);
  }

  if (finished === "0" || finished === "1") {
    const val = finished === "1";
    filtered = filtered.filter((b) => b.finished === val);
  }

  const responseBooks = filtered.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  return h
    .response({
      status: "success",
      data: { books: responseBooks },
    })
    .code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }

  return h
    .response({
      status: "success",
      data: { book },
    })
    .code(200);
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const idx = books.findIndex((b) => b.id === bookId);

  if (idx === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload ?? {};

  if (!name || name.trim() === "") {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[idx] = {
    ...books[idx],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };

  return h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const idx = books.findIndex((b) => b.id === bookId);

  if (idx === -1) {
    return h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  }

  books.splice(idx, 1);

  return h
    .response({
      status: "success",
      message: "Buku berhasil dihapus",
    })
    .code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
