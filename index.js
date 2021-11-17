const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.use(express.static("build"));

const mongoose = require("mongoose");
const { response } = require("express");

const url = `mongodb+srv://alejogb:${process.argv[2]}@cluster0.yvdek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
  },
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const phoneNumber = mongoose.model("Note", noteSchema);

if (process.argv.length > 3) {
  const number = new phoneNumber({
    name: process.argv[3],
    number: process.argv[4],
  });
  number.save().then((result) => {
    console.log(
      `Added number: ${result.number} of ${result.name} to phonebook`
    );
    mongoose.connection.close();
  });
} else {
  console.log("Ejecutar find");

  phoneNumber.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note.name, " ", note.number);
    });
  });
}

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
app.get("/api/persons", (request, response) => {
  phoneNumber
    .find({})
    .then((persons) => {
      if (persons) {
        response.json(persons);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  phoneNumber
    .findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.json(person.toJSON());
      }
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (request, response) => {
  try {
    const id = request.params.id;
    console.log(id);
    let person = persons.find((person) => {
      return toString(person.id) === toString(id);
    });
    response.status(204).end();
  } catch (error) {
    console.log("ERROR", error);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  console.log("NAME: ", body.number);
  const personName = body.name;
  const personNumber = body.number;
  if (body === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  function hasDuplicates(newElement) {
    let object = persons.find((element) => element.name === newElement);
    console.log("OBJECT ", object);
    if (object == undefined) {
      return false;
    }
    if (Object.keys(object).length !== 0) {
      return true;
    }
    return false;
  }
  if (personName === "") {
    response.json({ error: "name or number is empty" });
  } else if (hasDuplicates(personName)) {
    response.json({ error: "name is alreaded added" });
  }
  const number = new phoneNumber({
    name: personName,
    number: personNumber,
  });

  number
    .save()
    .then((savedNumber) => {
      response.json(savedNumber.toJSON());
    })
    .catch((error) => next(error));
});
app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people ${new Date()}`
  );
});
app.put("/api/persons", (request, response) => {
  let updatedNumbers = phoneNumber.findOneAndUpdate(request.param.object, {
    name: request.params.name,
  });

  console.log("OBJECT PUT: ", request.param.object);

  response.send(updatedNumbers);
});
app.use(errorHandler);

app.listen(process.env.PORT || 3001);
console.log(`Server running on port ${5000}`);
