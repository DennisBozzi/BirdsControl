
var idPai;
var idMae;
var id;
var nome;

listar(0)

function listar(val) {

    var limite = 16;
    var comeco = val * limite;

    $.ajax({
        url: 'http://localhost:3000/passaros?_start=' + comeco + '&_limit=' + limite,
        type: 'GET',
        success: function (res) {

            $.ajax({
                url: 'http://localhost:3000/passaros',
                type: 'GET',
                success: function (resCompleta) {

                    $("#paginacao").html("")
                    $("#tbody").html("")

                    for (var i = 0; i < res.length; i++) {

                        var id = res[i].id != null ? res[i].id : "";
                        var nome = res[i].nome != null ? res[i].nome : "";
                        var paiId = res[i].paiId != null ? res[i].paiId : "";
                        var maeId = res[i].maeId != null ? res[i].maeId : "";

                        var pai = paiId != "" ? resCompleta.find(element => element.id == paiId) : "";
                        var mae = maeId != "" ? resCompleta.find(element => element.id == maeId) : "";

                        var paiNome = pai != "" && pai != null ? pai.nome : "";
                        var maeNome = mae != "" && mae != null ? mae.nome : "";

                        $("#tbody").append('<tr data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="preencherModal(' + id + ')" ><td class="text-start">' + id + '</td><td>' + nome + '</td><td>' + paiNome + '</td><td>' + maeNome + '</td></tr>')
                    }

                    valMax = resCompleta.length / 16

                    for (let i = val >= 1 ? val - 1 : val; i < val + 2 && i < valMax; i++) {

                        $("#paginacao").append('<button class="btn btn-secondary" id="listar' + i + '" onclick="listar(' + (i) + ')">' + (i + 1) + '</button>')

                    }

                    document.getElementById('listar' + val).classList.add('selected')
                    ajustarPaginacao()
                }
            })
        }
    })
}

function preencherModal(val) {

    $.ajax({
        url: 'http://localhost:3000/passaros',
        type: 'GET',
        success: function (res) {

            id = val;
            var passaro = res.find(obj => obj.id == val)
            var pai = res.find(obj => obj.id == passaro.paiId)
            var mae = res.find(obj => obj.id == passaro.maeId)

            for (var i = 0; i < res.length; i++) {

                var ids = res[i].id
                var nomes = res[i].nome

                $("#pais").append('<option value="' + nomes + '- ' + ids + '">')
                $("#maes").append('<option value="' + nomes + '- ' + ids + '">')

            }

            $("#modalTitle").html(passaro.nome)
            $("#editNome").val(passaro.nome)

            if (pai != null) {
                $("#editPai").val(pai.nome + '- ' + pai.id)
            }

            if (mae != null) {
                $("#editMae").val(mae.nome + '- ' + mae.id)
            }

            popularVariaveis()

        }
    })

}

$("#editPai").on("change", function () {
    popularVariaveis()
})

$("#editMae").on("change", function () {
    popularVariaveis()
})

function popularVariaveis() {

    var inputPai = document.getElementById('editPai').value;
    var inputMae = document.getElementById('editMae').value;

    nome = document.getElementById('editNome').value;

    idPai = inputPai.includes("- ") ? inputPai.split("- ")[1] : idPai;
    idMae = inputMae.includes("- ") ? inputMae.split("- ")[1] : idMae;

    if (idPai != "") {
        $("#editPai").val(inputPai.split("- ")[0])
    }

    if (idMae != "") {
        $("#editMae").val(inputMae.split("- ")[0])
    }

}

function editarPassaro() {

    $.ajax({
        url: 'http://localhost:3000/passaros/' + id,
        type: 'PUT',
        data: {
            id: id,
            nome: nome,
            paiId: idPai,
            maeId: idMae
        }
    })

}

function ajustarPaginacao() {
    var paginacao = document.getElementById('paginacao');
    var wPaginacao = paginacao.getBoundingClientRect().width
    paginacao.style.left = 'calc(50% - ' + (wPaginacao / 2) + 'px)';
}