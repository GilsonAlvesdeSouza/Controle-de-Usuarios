class UserController {
    constructor(formIdCreate, formIdUpdate, tableEl) {
        this.formIdCreate = document.getElementById(formIdCreate);
        this.formIdUpdate = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableEl);
        this.onSubmit();
        this.onEdit();
        this.removeErrorRequired();
    }

    onEdit() {
        document.querySelector('#box-user-update .btn-cancelar').addEventListener('click', e => {
            this.showPainelCreate();
        });

        this.formIdUpdate.addEventListener('submit', event => {

            event.preventDefault();
            let btn = this.formIdUpdate.querySelector("[type=submit]");
            btn.disabled = true;

            let values = this.getValues(this.formIdUpdate);

            let index = this.formIdUpdate.dataset.trIndex;
            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);


            this.getPhoto(this.formIdUpdate).then(
                (content) => {
                    if (!values.photo) {
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }
                    tr.dataset.user = JSON.stringify(result);
                    tr.innerHTML =
                        `<td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${(result._admin) ? '✅' : '❌'}</td>
                        <td>${Utils.dateFormate(result._register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>`;
                    this.formIdUpdate.reset();
                    this.addEventTr(tr);
                    this.updateCount();
                    btn.disabled = false;
                    this.showPainelCreate();
                },
                (e) => {
                    console.error(e);
                });
        });
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
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>`;

        this.addEventTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    addEventTr(tr) {

        tr.querySelector('.btn-delete').addEventListener('click', e => {
            if(confirm("Deseja realmente excluir?")){
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector('.btn-edit').addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user);
            this.formIdUpdate.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {
                let field = this.formIdUpdate.querySelector(`[name=${name.replace('_', '')}]`);


                if (field) {

                    switch (field.type) {
                        case 'file':
                            continue;

                        case 'radio':
                            field = this.formIdUpdate.querySelector(`[name=${name.replace('_', '')}][value=${json[name]}`);
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
            this.formIdUpdate.querySelector(".photo").src = json._photo;
            this.showPainelUpdate();
        })
    }

    updateCount() {
        let numberUsers = 0;
        let numberUsersAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
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
        this.formIdCreate.addEventListener('submit', (event) => {
            event.preventDefault();
            let user = this.getValues(this.formIdCreate);

            let btnSubmit = this.formIdCreate.querySelector('[type=submit]');
            btnSubmit.disable = true;

            if (!user) return false;

            this.getPhoto(this.formIdCreate).then(
                (content) => {
                    user.photo = content;
                    this.addLine(user);

                    this.formIdCreate.reset();

                    btnSubmit.disable = false;
                },
                (e) => {
                    console.error(e);
                });
        });
    }

    getPhoto(form) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            let itens = [...form.elements].filter(item => {
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

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    removeErrorRequired() {
        let formName = this.formIdCreate.querySelector('[name=name]');
        let formEmail = this.formIdCreate.querySelector('[name=email]');
        let formPassword = this.formIdCreate.querySelector('[name=password]');

        let inputs = [formName, formEmail, formPassword];

        inputs.forEach(input => {
            this.addEventListenerAll(input, 'click keyup', evt => {
                input.parentElement.classList.remove('has-error');
            });
        });
    }

    getValues(form) {
        let user = {};
        let formValid = true;

        // console.log(this.formIdCreate.querySelector('[name=name]'));

        [...form.elements].forEach((field, index) => {

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
