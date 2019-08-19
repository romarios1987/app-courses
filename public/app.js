"use strict";

const toCurrency = (price) => {
    return new Intl.NumberFormat('en', {
        currency: 'USD',
        style: 'currency'
    }).format(price)
};


const toDate = (date) => {
    return new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
};



// $(document).ready(function(){
//     $('.sidenav').sidenav();
// });

document.addEventListener('DOMContentLoaded', function() {
    var elem = document.querySelector('.sidenav');
    var instance = M.Sidenav.init(elem, {
        inDuration: 350,
        outDuration: 350,
        edge: 'left' //or right
    });
});


document.querySelectorAll('.date').forEach((node) => {
    node.textContent = toDate(node.textContent)
});



document.querySelectorAll('.price').forEach((node) => {
    node.textContent = toCurrency(node.textContent)
});


const $cart = document.querySelector('#cart');

if ($cart) {
    $cart.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;

            fetch('/cart/remove/' + id, {
                method: 'delete'
            }).then((res) => res.json())
                .then((cart) => {
                    // console.log(cart);
                    if (cart.courses.length) {
                        const html = cart.courses.map((c) => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                </td>
                            </tr>`
                        }).join('');
                        $cart.querySelector('tbody').innerHTML = html;
                        $cart.querySelector('.price').textContent = toCurrency(cart.price);

                    } else {
                        $cart.innerHTML = '<h3>Cart is empty</h3>'
                    }
                })

        }
    })
}