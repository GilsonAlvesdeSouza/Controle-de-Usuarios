class UserController {
    constructor(formId, tableId) {
        this.formUser = document.getElementById(formId);
        this.tableId = document.getElementById(tableId);
        this.onSubmit();
    }

    addLine(user, tableId) {
        this.tableId.innerHTML =

            `<tr>
            <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.admin}</td>
            <td>${user.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>`;

    }

    onSubmit(){
        this.formUser.addEventListener('submit', (event) => {
            event.preventDefault();
            let user = this.getValues();
            this.addLine(user);
        });
    }

    getValues() {
        let user = {};

        [...this.formUser.elements].forEach((field, index) => {
            if (field.name == 'gender') {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else {
                user[field.name] = field.value;
            }
        });

        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    }
}
