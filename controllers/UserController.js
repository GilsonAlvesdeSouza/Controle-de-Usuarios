class UserController {
    constructor(formId, tableId) {
        this.formUser = document.getElementById(formId);
        this.tableId = document.getElementById(tableId);
        this.onSubmit();
        this.onEditCancel();
    }

    onEditCancel() {
        document.querySelector('#box-user-update .btn-cancelar').addEventListener('click', e => {
            this.showPainelCreate();
        })
    }

    showPainelCreate() {
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    showPainelUpdate() {
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }


    addLine(user) {

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(user);

        tr.innerHTML =
            `<td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${(user.admin) ? '✅' : '❌'}</td>
            <td>${Utils.dateFormate(user.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>`;
        tr.querySelector('.btn-edit').addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector('#form-user-update');

            for (let name in json) {
                let field = form.querySelector(`[name=${name.replace('_', '')}]`);


                if (field) {

                    switch (field.type) {
                        case 'file':
                            continue;

                        case 'radio':
                            field = form.querySelector(`[name=${name.replace('_', '')}][value=${json[name]}`);
                            field.checked = true;
                            break;

                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];

                    }
                }
            }

            this.showPainelUpdate();
        })

        this.tableId.appendChild(tr);

        this.updateCount();
    }

    updateCount() {
        let numberUsers = 0;
        let numberUsersAdmin = 0;

        [...this.tableId.children].forEach(tr => {
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if (user._admin) {
                numberUsersAdmin++;
            }
        });
        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberUsersAdmin;
    }

    onSubmit() {
        this.formUser.addEventListener('submit', (event) => {
            event.preventDefault();
            let user = this.getValues();

            let btnSubmit = this.formUser.querySelector('[type=submit]');
            btnSubmit.disable = true;

            if (!user) return false;

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
