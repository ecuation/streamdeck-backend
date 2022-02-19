import Datastore from "nedb";

export default class DBService {
  constructor() {
    this.db = new Datastore({
      filename: "src/database/jobs.db",
      autoload: true,
    });
  }

  async store(data) {
    return new Promise((resolve, reject) => {
      this.db.insert(data, function (err, newDoc) {
        if (err) {
          reject("Error: user cannot be saved.");
        }
        resolve(newDoc);
      });
    });
  }

  async list() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, function (err, numRemoved) {
        if (err) reject(err);

        resolve(numRemoved);
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $set: data },
        { multi: false },
        (err, numReplaced) => {
          if (err) reject(err);

          resolve(numReplaced);
        }
      );
    });
  }
}
