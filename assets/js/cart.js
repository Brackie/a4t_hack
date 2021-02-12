let cartItems = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {};
// window.onunload = function(){
// 	localStorage.setItem("cart", "");
// }
$(document).ready(function () {
	$(document).on('click', '.reduce', function (event) {
		event.preventDefault();
		const id = $(this).attr('id');
		reduceQuantity(id);
	});

	$(document).on('click', '.delete', function (event) {
		event.preventDefault();
		const id = $(this).attr('id');
		deleteItem(id);
		// openPwdialog(id);
	});

	document.getElementById("print").onclick = function (event) {
		event.preventDefault();
		if (!isEmptyObject(cartItems)) {
			submitSale();
		}
	};

	$('#close-pwdialog').on('click', closePwdialog);
});

function populateCart(newProduct = {}) {
	$('#cart-body').empty();
	if (!isEmptyObject(cartItems)) {
		for (product_id in cartItems) {
			addRow(cartItems[product_id]);
		}
	}
	if (!isEmptyObject(newProduct)) {
		addCartItem(newProduct);
	}
}

function addRow(product) {
	let div = `
	<div class="trow" id="row${product.product_id}">
		<p class="tdata">${product.product_id}</p>
		<p class="tdata">${product.product_name}</p>
		<p class="tdata">${product.product_brand}</p>
		<p class="tdata">${product.product_capacity}</p>
		<p class="tdata">${product.product_price}</p>
		<p class="tdata" id="quantity">${product.quantity}</p>
		<p class="tdata"><button class="reduce" id="${product.product_id}"><span class="fa fa-minus">
		</span></button></p>
		<p class="tdata"><button class="delete" id="${product.product_id}"><span class="fa fa-close">
		</span></button></p>
	</div>`;
	$('#cart-body').append(div);
	if (product.quantity > 1) {
		updatePrice(product.product_price, product.quantity);
	} else {
		updatePrice(product.product_price);
	}
}

function addCartItem(product) {
	product.quantity = 1;
	if (!cartItems.hasOwnProperty(product.product_id)) {
		cartItems[product.product_id] = product;
		localStorage.setItem('cart', JSON.stringify(cartItems));
		addRow(product);
	} else {
		const element = $("#row" + product.product_id + " #quantity");
		let quantity = parseInt(element.text());
		cartItems[product.product_id].quantity = ++quantity;
		localStorage.setItem('cart', JSON.stringify(cartItems));
		element.text(quantity);
		updatePrice(product.product_price);
	}
}

function reduceQuantity(id) {
	const element = $("#row" + id + " #quantity");
	let quantity = element.text();
	if (quantity > 1) {
		cartItems[id].quantity = --quantity;
		localStorage.setItem('cart', JSON.stringify(cartItems));
		element.text(quantity);
		updatePrice(-cartItems[id].product_price);
	}
}

function deleteItem(id) {
	if (!isEmptyObject(cartItems)) {
		if (cartItems[id].quantity > 1) {
			updatePrice(-cartItems[id].product_price, cartItems[id].quantity);
		} else {
			updatePrice(-cartItems[id].product_price);
		}
		delete cartItems[id];
		localStorage.setItem('cart', JSON.stringify(cartItems));
		$('#row' + id).detach();
		if (isEmptyObject(cartItems)) {
			$('#cart-body').append(`<div class="trow"><p class="tdata">No Items in the cart<p></div>`);
		}
	}
}

function updatePrice(productPrice, quantity = 1, productDiscount = 0) {
	let sub_total = parseFloat($('#sub-total').text());
	let vat_sub_total = parseFloat($('#vat-sub-total').text());
	let discount = parseFloat($('#discount').text());
	let total = parseFloat($('#total').text());

	sub_total += (productPrice * quantity * 0.84);
	$('#sub-total').text(sub_total);

	vat_sub_total += (productPrice * quantity * 0.16);
	$('#vat-sub-total').text(vat_sub_total);

	discount += (productPrice * quantity * productDiscount);
	$('#discount').text(discount);

	total = ((sub_total + vat_sub_total) - discount);
	$('#total').text(total);
}

function openPwdialog(id) {
	$('.password-dialog').fadeIn('fast', 'swing');
	$('#pwd-form').on('submit', function (event) {
		event.preventDefault();
		deleteItem(id);
	});
}

function closePwdialog() {
	$('.password-dialog').fadeOut('fast', 'swing');
}

function submitSale() {
	const url = server + "sales";
	const CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');

	const payment_method = $("input[name='payment_method']").val();
	if (!payment_method) {
		showPrompt("Choose payment method", 0);
		return;
	}

	$.ajax({
        url: url,
        type: 'post',
        dataType: "json",
        data: {
            _token: CSRF_TOKEN,
			products: cartItems,
			total: $('#total').text(),
			payment_method: payment_method
        },
        success: function( data ) {
			console.log(data);
        }
    });

}
