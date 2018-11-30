import * as express from "express";
import * as loki from "lokijs";
import * as basic from "express-basic-auth";
import * as path from "path";

const app = express();
const port = parseInt(process.argv[2]) || 8080;
app.use(express.json());

const maxGuests = 10;

interface IGuest {
  firstName: string;
  lastName: string;
}

interface IParty {
  id: number;
  title: string;
  location: string;
  date: string;
  guests: IGuest[];
}

const db = new loki(path.join(__dirname, "loki.json"), {
  autoload: true,
  autosave: true,
  autosaveInterval: 100,
  persistenceMethod: "fs",
  autoloadCallback: () => {
    parties = db.getCollection("parties") || db.addCollection("parties");
  }
});

let parties: Collection<IParty> | null = null;

app.post("/party", (req, res) => {
  const party = parties.findOne({ id: parseInt(req.params.partyId) });
  if (!party) {
    parties.insert({
      id: req.body.id,
      title: req.body.title,
      location: req.body.location,
      date: req.body.date,
      guests: []
    });
    return res.status(201).send();
  }
  return res.status(409).send();
});

app.get("/party/:partyId", (req, res) => {
  const party = parties.findOne({ id: parseInt(req.params.partyId) });
  if (party) {
    const { id, title, location, date } = party;
    return res.json({ id, title, location, date });
  }
  res.status(404).send();
});

app.post("/party/:partyId/register", (req, res) => {
  const party = parties.findOne({ id: parseInt(req.params.partyId) });

  if (party.guests.length < maxGuests) {
    const guest: IGuest = {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    if (!guest.firstName || !guest.lastName) {
      return res.status(400).send();
    }

    parties.update({ ...party, guests: [...party.guests, guest] });
    return res.status(201).send();
  }
  return res.status(401).send();
});

app.get(
  "/party/:partyId/guests",
  basic({ users: { admin: "P@ssw0rd!" } }),
  (req, res) => {
    const party = parties.findOne({ id: parseInt(req.params.partyId) });
    if (party) {
      return res.json(party.guests);
    }
    return res.status(404).send();
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
