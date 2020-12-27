class User {
  constructor(id, name, gender, birth, country, email, password, photo, admin) {
    this._name = name;
    this._gender = gender;
    this._birth = birth;
    this._country = country;
    this._email = email;
    this._password = password;
    this._photo = photo;
    this._admin = admin;
    this._createdAt = new Date();
    this._id = id;
  }
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get gender() {
    return this._gender;
  }
  get birth() {
    return this._birth;
  }
  get country() {
    return this._country;
  }
  get email() {
    return this._email;
  }
  get photo() {
    return this._photo;
  }
  set photo(value) {
    this._photo = value;
  }
  get password() {
    return this._password;
  }
  get admin() {
    return this._admin;
  }
  get createdAt() {
    return this._createdAt;
  }

  loadFromJSON(userJSON) {
    for (let name in userJSON) {
      switch (name) {
        case "_createdAt":
          this[name] = new Date(userJSON[name]);
          break;
        default:
          if (name.substring(0,1) === "_") this[name] = userJSON[name];
      }
    }
  }

  toJSON() {
    let json = {};
    Object.keys(this).forEach((key) => {
      if (this[key] !== undefined && this[key] !== "") {
        json[key] = this[key];
      }
    });
    return json;
  }

  save() {
    return new Promise((resolve, reject) => {
      let promise;
      console.log("metodo save", this);
      if (this.id) {
        promise = Fetch.put(`/users/${this.id}`, this.toJSON());
      } else {
        promise = Fetch.post("/users", this.toJSON());
      }
      promise
        .then((data) => {
          this.loadFromJSON(data);
          resolve(this);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  delete() {
    return Fetch.delete(`/users/${this.id}`, this.params);
  }

  static get() {
    return Fetch.get("/users");
  }
}
