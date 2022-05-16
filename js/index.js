let repositori = {
    "Jet Tempur": 10,
    "Nuklir Hiroshima": 1,
    "Infinity Stone": 6,
    "Burj Khalifa": 5,
    "Rudal Hipersonik": 3
};

function produkBelumDipesan(obj1, obj2) {
    const keys = Object.keys(obj1).filter(key => key in obj2);

    const inv = Object.assign({}, obj1)
    for (const key of keys) {
        delete inv[key]
    }

    return inv
}

function jumlahProdukValid() {
    const pesanan = getPesanan();
    if (Object.keys(pesanan).length <= 0) {
        return false
    }

    for (const id of Object.keys(pesanan)) {
        if(!repositori.hasOwnProperty(id))
            return false
        if (pesanan[id] <= 0 || pesanan[id] > repositori[id])
            return false
    }

    return true
}

function getPesanan() {
    const pesanan = {};

    $("#pilihProduk me").each(function(index) {
        const id = $(this).find($("select option:selected")).val();
        const val = $(this).find($("input")).val()

        if(id == undefined || val == undefined)
            return
        if (id === "Pilih Produk")
            return

        pesanan[id] = val;
    })

    return pesanan;
}

function bagianDaftarPesanan() {
    let today = new Date();
    const name = `<h2>Daftar Pesanan ${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}</h2>`;
    const pesanan = getPesanan();
    const items = Object.keys(pesanan).map(id => `<li>${id} (${pesanan[id]})</li>`);

    return [
        name,
        "<ul>",
        ...items,
        "</ul>"
    ].join("\n");
}

function bagianBaruPesanan(products) {
    const opts = Object.keys(products).map(p => `<option value='${p}'>${p}</option>`);

    const result = [
        `<div class="col-sm-4">`,
        `<select class="form-select">`,
        `<option selected disabled>Pilih Produk</option>`
    ].concat(opts, [
        "</select>",
        "</div>"]).join("\n");
    return result;
}

function bagianProdukBaru() {
    const pesanan = getPesanan();
    const jumlahOrder = Object.keys(pesanan).length;

    const prods = produkBelumDipesan(repositori, pesanan);

    let productOption = bagianBaruPesanan(prods);
    let productInput = `<div class="col-sm-6"><input type="number" value="1" class='form-control'></div>`;
    let tombolDelete = "";

    if (jumlahOrder > 0)
        tombolDelete = `<button type="button" class='btn btn-outline-danger btn-cl col-sm-1'>X</button>`;
    
    return [
        "<me class='row mb-3'>",
        productOption,
        productInput,
        tombolDelete,
        "</me>",
    ].join("\n")
}

function aksiHapusPesanan() {
    $("#pilihProduk me:last-child").remove();
    $("#pilihProduk me:last-child button").show();

    $("#tombolTambah").show();

    $("#pilihProduk me:last-child select").attr("disabled", false);
}

$(document).ready(function() {
    $("#tombolTambah").hide();
    $("#tombolTambah").click(function() {
        const prodSelected = $("#pilihProduk me:last-child select").val();
        const prodJumlah = parseInt($("#pilihProduk me:last-child input").val());

        if(!repositori.hasOwnProperty(prodSelected)) {
            alert("produk tidak terdaftar");
            return
        }

        if(prodJumlah <= 0 || prodJumlah > repositori[prodSelected]) {
            alert("jumlah produk tidak valid");
            return
        }

        if(isNaN(prodJumlah)) {
            alert("produk bukan merupakan angka");
            return
        }

        $("#pilihProduk me:last-child select").attr("disabled", true);
        $("#pilihProduk me:last-child button").hide();


        $("#pilihProduk").append(bagianProdukBaru());
        $("#pilihProduk me:last-child button").bind('click', aksiHapusPesanan);

        const pesanan = getPesanan();
        const jumlahOrder = Object.keys(pesanan).length;
        const jumlahRepo = Object.keys(repositori).length

        if (jumlahOrder == jumlahRepo)
            $(this).hide();
    })

    $("#pilihProduk").append(bagianProdukBaru());

    $("#pilihProduk me select").change(function() {
        $("#tombolTambah").show();
    })

    $("#tombolPesan").click(function() {
        if (!jumlahProdukValid()) {
            alert("produk pesanan tidak valid")
            return
        }

        $("#daftarPesan").html(bagianDaftarPesanan())
    })
})