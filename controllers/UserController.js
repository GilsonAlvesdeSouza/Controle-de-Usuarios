class UserController {
    constructor(formId, tableId) {
        this.formUser = document.getElementById(formId);
        this.tableId = document.getElementById(tableId);
        this.onSubmit();
    }

    addLine(user, tableId) {

        let tr = document.createElement('tr');
        tr.innerHTML =
            `<td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${(user.admin ? 'Sim' : 'Não')}</td>
            <td>${Utils.dateFormate(user.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>`;
        this.tableId.appendChild(tr);
    }

    onSubmit() {
        this.formUser.addEventListener('submit', (event) => {
            event.preventDefault();
            let user = this.getValues();

            let btnSubmit = this.formUser.querySelector('[type=submit]');
            btnSubmit.disable = true;

            this.getPhoto().then(
                (content) => {
                    user.photo = content;
                    this.addLine(user);

                    this.formUser.reset();

                    btnSubmit.disable = false;
                },
                (e) => {
                    console.error(e);
                });
        });
    }

    getPhoto() {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            let itens = [...this.formUser.elements].filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = itens[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (e) => {
                reject(e);
            }

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        });

    }

    getValues() {
        let user = {};
        let formValid = true;

        [...this.formUser.elements].forEach((field, index) => {

            if (['name', 'email', 'password',].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                formValid = false;
            }

            if (field.name == 'gender') {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name === 'admin') {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!formValid) return false;

        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    }
}