const url = 'http://localhost:3000/products';
const body = document.querySelector('body');
const listProductsHTML = document.querySelector('.listProducts');
const listCartHTML = document.querySelector('.listCart');
const iconCartSpan = document.querySelector('.icon-cart span');
const iconCart = document.querySelector('.icon-cart');
const closeCart = document.querySelector('.close'),
	listItemChangeHTML = document.querySelector('.listItemChange'),
	select = document.querySelector('.select'),
	filterPriceForm = document.querySelector('.filterPriceForm'),
	filterPriceFormOne = document.querySelector('.filterPriceFormOne'),
	filterPriceFormTwo = document.querySelector('.filterPriceFormTwo'),
	removeFilter = document.querySelector('.removeFilter'),
	pagination = document.querySelector('.pagination'),
	paginationFilter = document.querySelector('.paginationFilter'),
	alphabetFilter = document.querySelector('.alphabetFilter'),
	ratingFilter = document.querySelector('.ratingFilter');
let products = [];
let cart = [];
let min = 0;
let max = 0;
let limit = 4;

iconCart.addEventListener('click', () => {
	body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
	body.classList.toggle('showCart');
});

const addDataToHTML = () => {
	const newNewProducts = localStorage.getItem('filterProduct');
	if (JSON.parse(newNewProducts) != null) {
		products = JSON.parse(newNewProducts);
	}
	listProductsHTML.innerHTML = '';
	if (products.length > 0) {
		products.forEach(product => {
			let newProduct = document.createElement('div');
			newProduct.dataset.id = product.id;
			newProduct.classList.add('item');
			newProduct.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <h2 data-id="${product.id}" class="h2-title">${product.title}</h2>
          <input data-id="${product.id}" class="item-input" value="${
				product.title
			}"/>
          <button data-id="${
						product.id
					}" class="buttonChangeInput">Save</button>
          <div class="price">${product.price}</div>
          <button class="addCart">Add To Cart</button>
          <button data-id="${
						product.id
					}" class="changeCardButton">Change</button>
					<span id="${product.id}" class="like">
						<i class="fa-${product.like ? 'solid' : 'regular'} fa-heart fa-xl"></i>
					</span>
        `;
			listProductsHTML.appendChild(newProduct);
		});
		const addToCartClick = document.querySelectorAll('.addCart'),
			buttonSaveInput = document.querySelectorAll('.buttonChangeInput'),
			changeCardButton = document.querySelectorAll('.changeCardButton'),
			like = document.querySelectorAll('.like');
		like.forEach(el => {
			el.addEventListener('click', () => createLike(el.id));
		});
		clickAddToCart(addToCartClick);
		changeInput(buttonSaveInput);
		changeCardButtonFunc(changeCardButton);
	}
};

const clickAddToCart = add => {
	add.forEach(el => {
		el.addEventListener('click', () => {
			if (el.classList.contains('addCart')) {
				let id_product = el.parentElement.dataset.id;
				addToCart(id_product);
			}
		});
	});
};

const addToCart = product_id => {
	const newNewCart = localStorage.getItem('cart');
	if (JSON.parse(newNewCart) != null) {
		cart = JSON.parse(newNewCart);
	}
	let positionThisProductInCart = cart.findIndex(
		value => value.product_id === product_id
	);
	if (cart.length <= 0) {
		cart = [
			{
				product_id: product_id,
				quantity: 1,
			},
		];
	} else if (positionThisProductInCart < 0) {
		cart.push({
			product_id: product_id,
			quantity: 1,
		});
	} else {
		cart[positionThisProductInCart].quantity =
			cart[positionThisProductInCart].quantity + 1;
	}
	localStorage.setItem('cart', JSON.stringify(cart));
	addCartToHTML();
};

const plusFunc = product_id => {
	const newNewCart = localStorage.getItem('cart');
	if (JSON.parse(newNewCart) != null) {
		cart = JSON.parse(newNewCart);
	}
	let positionThisProductInCart = cart.findIndex(
		value => value.product_id === product_id
	);
	cart[positionThisProductInCart].quantity =
		cart[positionThisProductInCart].quantity + 1;
	localStorage.setItem('cart', JSON.stringify(cart));
	addCartToHTML();
};

const minusFunc = product_id => {
	const newNewCart = localStorage.getItem('cart');
	if (JSON.parse(newNewCart) != null) {
		cart = JSON.parse(newNewCart);
	}
	let positionThisProductInCart = cart.findIndex(
		value => value.product_id === product_id
	);
	cart[positionThisProductInCart].quantity =
		cart[positionThisProductInCart].quantity - 1;
	localStorage.setItem('cart', JSON.stringify(cart));
	addCartToHTML();
};

const addCartToHTML = () => {
	const newNewCart = localStorage.getItem('cart');
	if (JSON.parse(newNewCart) != null) {
		cart = JSON.parse(newNewCart);
	}
	listCartHTML.innerHTML = '';
	const hello = cart.findIndex(item => item.quantity === 0);
	if (hello >= 0) {
		cart.splice(hello, 1);
	}
	let totalQuantity = 0;
	if (cart.length > 0) {
		cart.forEach(item => {
			totalQuantity = totalQuantity + item.quantity;
			let newItem = document.createElement('div');
			newItem.classList.add('item');
			newItem.dataset.id = item.product_id;

			let positionProduct = products.findIndex(
				value => value.id === item.product_id
			);
			let info = products[positionProduct];
			newItem.innerHTML = `
          <div class="image">
            <img src="${info.image}" alt="" />
            <div class="name">${info.title}</div>
            <div class="totalPrice">${info.price * item.quantity}</div>
            <div data-id="${info.id}" class="quantity">
              <span class="minus">-</span>
              <span>${item.quantity}</span>
              <span class="plus">+</span>
            </div>
          </div>
      `;
			listCartHTML.appendChild(newItem);
		});
	}
	localStorage.setItem('cart', JSON.stringify(cart));
	iconCartSpan.innerText = totalQuantity;
	const minus = document.querySelectorAll('.minus'),
		plus = document.querySelectorAll('.plus');
	minusPlus(minus, plus);
};

const minusPlus = (minus, plus) => {
	plus.forEach(e => {
		e.addEventListener('click', () => {
			const nun = e.parentElement.dataset.id;
			plusFunc(nun);
		});
	});
	minus.forEach(e => {
		e.addEventListener('click', () => {
			const nun = e.parentElement.dataset.id;
			minusFunc(nun);
		});
	});
};

const changeInput = saveBut => {
	const input = document.querySelectorAll('.item-input'),
		title = document.querySelectorAll('.h2-title');
	title.forEach(element => {
		element.addEventListener('click', () => {
			for (let i = 0; i < 20; i++) {
				if (
					input[i].dataset.id === element.dataset.id &&
					saveBut[i].dataset.id === element.dataset.id
				) {
					input[i].classList.toggle('item-input-open');
					saveBut[i].classList.toggle('buttonChangeInput-open');
					saveInput(input[i], saveBut[i]);
				}
			}
		});
	});
};

const saveInput = (input, saveBut) => {
	saveBut.addEventListener('click', async () => {
		fetch(`http://localhost:3000/products/${input.dataset.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: `${input.value}`,
			}),
		});

		const res = await fetch(url);
		const json = await res.json();
		const products = json;
		localStorage.setItem('filterProduct', JSON.stringify(products));
		addDataToHTML();
	});
};

const changeCardButtonFunc = but => {
	but.forEach(element => {
		element.addEventListener('click', () => {
			const newProducts = products.filter(e => e.id === element.dataset.id),
				itemChange = document.createElement('div');
			itemChange.classList.add('itemChange');
			itemChange.innerHTML = `
      <div class="itemChange-e1">
          <img id="itemChangeImg" src="${newProducts[0].image}"/>
          <input id="itemChangeImgId" type="file"/>
          <label class="labelImg" for="itemChangeImgId">Change photo</label>
          <label>Change title: <input placeholder="Change title" class="itemChangeTitle" type="text" value="${newProducts[0].title}"/></label>
          <label>Change price: <input placeholder="Change price" class="itemChangePrice" type="number" value="${newProducts[0].price}"/></label>
      </div>
      <div class="itemChange-e2">
        <button class="itemChange__close">Close</button>
        <button class="itemChange__save">Save</button>
      </div>
      `;
			listItemChangeHTML.innerHTML = '';
			listItemChangeHTML.appendChild(itemChange);
			listItemChangeHTML.classList.toggle('listItemChangeHTML-open');
			itemChangeFunc(newProducts);
		});
	});
};
const itemChangeFunc = p => {
	const itemChangeImg = document.getElementById('itemChangeImg'),
		itemChangeImgInput = document.getElementById('itemChangeImgId'),
		itemChangeClose = document.querySelector('.itemChange__close'),
		itemChangeSave = document.querySelector('.itemChange__save'),
		itemChangeTitle = document.querySelector('.itemChangeTitle'),
		itemChangePrice = document.querySelector('.itemChangePrice');

	itemChangeClose.addEventListener('click', () =>
		listItemChangeHTML.classList.toggle('listItemChangeHTML-open')
	);
	itemChangeSave.addEventListener('click', async () => {
		let changeNewItem = [...p];
		changeNewItem[0].image = itemChangeImg.src;
		changeNewItem[0].title = itemChangeTitle.value;
		changeNewItem[0].price = itemChangePrice.value;
		fetch(`http://localhost:3000/products/${changeNewItem[0].id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(changeNewItem[0]),
		});
		const res = await fetch(url);
		const json = await res.json();
		const products = json;
		localStorage.setItem('filterProduct', JSON.stringify(products));
		addDataToHTML();
	});

	imgFileEventListener(itemChangeImg, itemChangeImgInput);
};

const imgFileEventListener = (img, inp) => {
	inp.addEventListener('change', () => {
		img.src = URL.createObjectURL(inp.files[0]);
	});
};
const filterByC = () => {
	let newArrProductsC = [];
	products.forEach(item => {
		newArrProductsC.push(item.category);
	});
	const newArr = [...new Set(newArrProductsC)];
	newArr.forEach(e => {
		const nweSelect = document.createElement('option');
		nweSelect.innerHTML = e;
		select.appendChild(nweSelect);
	});
};

select.addEventListener('change', async () => {
	const res = await fetch(
		`http://localhost:3000/products?category=${select.value}`
	);
	products = await res.json();
	localStorage.setItem('filterProduct', JSON.stringify(products));
	addDataToHTML();
	filterMinMaxPrice();
});

filterPriceForm.addEventListener('submit', e => {
	e.preventDefault();
	if (filterPriceFormOne.value !== '' && filterPriceFormTwo.value !== '') {
		if (filterPriceFormOne.value < min || filterPriceFormTwo.value > max) {
			alert('The field is filled in incorrectly');
		} else {
			const filterPriceProducts = products.filter(
				el =>
					parseInt(el.price) >= parseInt(filterPriceFormOne.value) &&
					parseInt(el.price) <= parseInt(filterPriceFormTwo.value)
			);
			products = [...filterPriceProducts];
			localStorage.setItem('filterProduct', JSON.stringify(products));
			addDataToHTML();
		}
	} else {
		alert('The field is not filled');
	}
	filterPriceFormOne.value = '';
	filterPriceFormTwo.value = '';
});

const filterMinMaxPrice = () => {
	const newFilterMinMaxPrice = [...products];
	let nweFilterPriceProductsArr = [];
	newFilterMinMaxPrice.forEach(el => nweFilterPriceProductsArr.push(el.price));
	const numericValues = nweFilterPriceProductsArr
		.filter(value => typeof value === 'number')
		.map(Number);

	min = Math.min(...numericValues);
	max = Math.max(...numericValues);

	filterPriceFormOne.placeholder = `form ${min}`;

	filterPriceFormTwo.placeholder = `to ${max}`;
};

removeFilter.addEventListener('click', async () => {
	const res = await fetch('http://localhost:3000/products');
	products = await res.json();
	localStorage.setItem('filterProduct', JSON.stringify(products));
	addDataToHTML();
	filterMinMaxPrice();
});

const funcLimit = () => {
	const numberOfPages = products.length / limit,
		limitProducts = [...products];
	pagination.innerHTML = '';
	for (let index = 1; index <= numberOfPages; index++) {
		const item = document.createElement('button');
		item.classList.add('buttonPagination');
		item.textContent = index;
		pagination.appendChild(item);
	}
	const buttonPagination = document.querySelectorAll('.buttonPagination');
	buttonPagination.forEach(e => {
		e.addEventListener('click', () =>
			funcPagination(e.textContent, limitProducts)
		);
	});
	paginationFilter.addEventListener('click', () => {
		pagination.innerHTML = '';
		funcPagination(1, limitProducts);
		for (let index = 1; index <= numberOfPages; index++) {
			const item = document.createElement('button');
			item.classList.add('buttonPagination');
			item.textContent = index;
			pagination.appendChild(item);
		}
		const buttonPagination = document.querySelectorAll('.buttonPagination');
		buttonPagination.forEach(e => {
			e.addEventListener('click', () =>
				funcPagination(e.textContent, limitProducts)
			);
		});
	});
};

const funcPagination = (but, p) => {
	let maxLimit = limit,
		minLimit = 0;

	for (let i = 1; i < but; i++) {
		minLimit += limit;
		maxLimit += limit;
	}
	const products = p.slice(minLimit, maxLimit);
	localStorage.setItem('filterProduct', JSON.stringify(products));
	addDataToHTML();
};

const ratingAlphabetFunc = () => {
	const newProducts = [...products];
	ratingFilter.addEventListener('click', () =>
		ratingAlphabetFilterFunc(true, newProducts)
	);
	alphabetFilter.addEventListener('click', () =>
		ratingAlphabetFilterFunc(false, newProducts)
	);
};

const ratingAlphabetFilterFunc = (boolean, products) => {
	if (boolean) {
		products.sort((a, b) => a.rating.rate - b.rating.rate);
		localStorage.setItem('filterProduct', JSON.stringify(products));
		addDataToHTML();
	} else {
		products.sort((a, b) => {
			const A = a.title.toUpperCase();
			const B = b.title.toUpperCase();
			if (A < B) {
				return -1;
			} else if (A > B) {
				return 1;
			}
			return 0;
		});
		localStorage.setItem('filterProduct', JSON.stringify(products));
		addDataToHTML();
	}
};

const createLike = async e => {
	const newProduct = products.findIndex(el => el.id === e);
	if (
		products[newProduct].like === undefined ||
		products[newProduct].like === false
	) {
		products[newProduct].like = true;
	} else if (products[newProduct].like === true) {
		products[newProduct].like = false;
	}
	await fetch(`http://localhost:3000/products/${products[newProduct].id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(products[newProduct]),
	});
	localStorage.setItem('filterProduct', JSON.stringify(products));
};

const initApp = () => {
	fetch(url)
		.then(res => res.json())
		.then(json => {
			products = json;
			filterByC();
			funcLimit();
			addDataToHTML();
			filterMinMaxPrice();
			ratingAlphabetFunc();
			addCartToHTML();
		});
};

initApp();
