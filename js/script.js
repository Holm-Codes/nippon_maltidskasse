document.addEventListener('DOMContentLoaded', function() {
    const quantityElement = document.getElementById('antal');
    const decreaseButton = document.getElementById('fjern');
    const increaseButton = document.getElementById('tilfoj');
    const rullemenuer = document.querySelectorAll('.rullemenu');

    let quantity = 3;

    // Funktion til at opdatere antallet vist på siden
    function updateQuantity() {
        quantityElement.textContent = quantity;
    }

    // Formindsk antal-knap funktion
    decreaseButton.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            updateQuantity();
        }
    });

    // Forøg antal-knap funktion
    increaseButton.addEventListener('click', function() {
        quantity++;
        updateQuantity();
    });

    // Dropdown funktionalitet
    rullemenuer.forEach(rullemenu => {
        const knap = rullemenu.querySelector('.rullemenuknappe');
        const indhold = rullemenu.querySelector('.rullemenu-indhold');
        const afkrydsningsfelter = indhold.querySelectorAll('input[type="checkbox"]');

        // Vis/skjul dropdown-indhold når der klikkes på knappen
        knap.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default button behavior
            indhold.style.display = indhold.style.display === 'block' ? 'none' : 'block';
        });

        // Lyt efter ændringer i afkrydsningsfelter og opdater knaptekst
        afkrydsningsfelter.forEach(afkrydsningsfelt => {
            afkrydsningsfelt.addEventListener('change', function() {
                opdaterKnapTekst(rullemenu);
            });
        });
    });

    // Funktion til at opdatere knapteksten baseret på valgte afkrydsningsfelter
    function opdaterKnapTekst(rullemenu) {
        const knap = rullemenu.querySelector('.rullemenuknappe');
        const afkrydsningsfelter = rullemenu.querySelectorAll('input[type="checkbox"]:checked');
        const oprindeligTekst = knap.getAttribute('data-oprindelig-tekst') || knap.textContent;

        if (afkrydsningsfelter.length > 0) {
            knap.textContent = `${oprindeligTekst} (${afkrydsningsfelter.length})`;
        } else {
            knap.textContent = oprindeligTekst;
        }

        if (!knap.getAttribute('data-oprindelig-tekst')) {
            knap.setAttribute('data-oprindelig-tekst', oprindeligTekst);
        }
    }
});