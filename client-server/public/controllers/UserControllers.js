class UserController {
  constructor(formIdCreate, formIdUpdate, tableId) {
    this.formCreateEl = document.getElementById(formIdCreate);
    this.formUpdateEl = document.getElementById(formIdUpdate);
    this.tableEl = document.getElementById(tableId);
    this.onSubmit(this.formCreateEl);
    this.onEdit();
    this.selectUsers();
  }

  onEdit() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPanelCreate();
      });

    this.onSubmit(this.formUpdateEl);
  }

  onSubmit(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const btnSubmit = form.querySelector("[type=submit]");
      let user = this.getNewUser(form);
      if (!user) {
        return false;
      }
      btnSubmit.disabled = true;
      user.photo = "";
      this.getPhoto(form).then(
        (content) => {
          user.photo = content;
          let tr;
          if (this.isUpdate(form)) {
            tr = document.getElementById(user._id);
          }
          user.save().then((user) => {
            this.addUser(tr, user);
            form.reset();
            btnSubmit.disabled = false;
            if (this.isUpdate(form)) {
              this.showPanelCreate();
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
    });
  } //onSubmit

  getPhoto(form) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      let elements = [...form.elements].filter((item) => {
        if (item.name === "photo") {
          return item;
        }
      });

      let file = elements[0].files[0];
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (e) => {
        reject(e);
      };

      if (file) {
        fileReader.readAsDataURL(file);
      } else if (this.isUpdate(form)) {
        resolve(document.querySelector(".photo").src);
      } else {
        resolve("./dist/img/boxed-bg.jpg");
      }
    });
  } //getPhoto

  getNewUser(form) {
    let user = {};
    let isValid = true;
    [...form.elements].forEach((field) => {
      if (
        ["name", "email", "password"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        field.parentElement.classList.add("has-error");
        isValid = false;
      }
      if (field.name == "gender") {
        if (field.checked) {
          user[field.name] = field.value;
        }
      } else if (field.name == "admin") {
        user[field.name] = field.checked;
      } else {
        user[field.name] = field.value;
      }
    });

    if (!isValid) {
      return false;
    }
    return new User(
      user.id ? user.id: undefined,
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo ? user.photo: undefined,
      user.admin
    );
  } //getNewUser

  updateCount() {
    let countUser = 0;
    let countAdmin = 0;
    [...this.tableEl.children].forEach((tr) => {
      countUser++;
      let user = JSON.parse(tr.dataset.user);
      if (user._admin) {
        countAdmin++;
      }
    });
    document.querySelector("#number-users").innerHTML = countUser;
    document.querySelector("#number-users-admin").innerHTML = countAdmin;
  } ///updateCount

  addUser(tr, dataUser) {
    if (!tr) tr = document.createElement("tr");
    tr.dataset.user = JSON.stringify(dataUser);
    tr.innerHTML = `
        <td><img src="${
          dataUser.photo
        }" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${dataUser.admin ? "Sim" : "Não"}</td>
        <td>${Utils.dateFormat(dataUser.createdAt)}</td>
        <td>
        <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat btn-del">Excluir</button>
        </td>`;
    tr.setAttribute("id", dataUser.id);
    tr.querySelector(".btn-edit").addEventListener("click", () => {
      this.showPanelUpdate();
      let userEdit = JSON.parse(tr.dataset.user);
      let formEdit = document.querySelector("#form-user-update");
      console.log('userEdit', userEdit);
      for (let name in userEdit) {
        let field = formEdit.querySelector(
          "[name=" + name.replace("_", "") + "]"
        );
        if (field) {
          switch (field.type) {
            case "file":
              continue;
              break;
            case "radio":
              field = formEdit.querySelector(
                "[name=" +
                  name.replace("_", "") +
                  "][value=" +
                  userEdit[name] +
                  "]"
              );
              field.checked = true;
              break;
            case "checkbox":
              field.checked = userEdit[name];
              break;
            default:
              field.value = userEdit[name];
          }
        }
        formEdit.querySelector(".photo").src = userEdit._photo;
      }
    });

    tr.querySelector(".btn-del").addEventListener("click", () => {
      if (confirm("Confirma a exclusão do item?")) {
        let user = new User();
        user.loadFromJSON(JSON.parse(tr.dataset.user));
        user.delete().then(()=>{
          tr.remove();
          this.updateCount();  
        });
      }
    });
    this.tableEl.appendChild(tr);
    this.updateCount();
  } //addUser

  showPanelCreate() {
    document.querySelector("#box-user-create").style.display = "block";
    document.querySelector("#box-user-update").style.display = "none";
  } //showPanelCreate

  showPanelUpdate() {
    document.querySelector("#box-user-create").style.display = "none";
    document.querySelector("#box-user-update").style.display = "block";
  } //showPanelUpdate

  isUpdate(form) {    
    return form.elements[0].value !== "";
  } //isUpdate

  selectUsers() {
    User.get().then((data) => {
      data.users.forEach((dataUser) => {
        let user = new User();
        user.loadFromJSON(dataUser);
        this.addUser(undefined, user);
      });
    });
  }
}
