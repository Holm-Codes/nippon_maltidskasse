document.addEventListener('DOMContentLoaded', function() {
    const quantityElement = document.getElementById('antal');
    const decreaseButton = document.getElementById('fjern');
    const increaseButton = document.getElementById('tilfoj');
    const rullemenuer = document.querySelectorAll('.rullemenu');
    const recipeTextElement = document.querySelector('.recipe-container > p');
    const priceElement = document.getElementById('pris');
    const rydKnap = document.getElementById('ryd-knap');
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    const ingredientsList = document.getElementById('ingredients-list');

    // Basisværdier for ingredienser
    const baseIngredients = {
        fond: 2, // liter
        hvidlog: 4, // antal
        ingefaer: 5, // cm
        sojasauce: 2, // spsk
        sesamolie: 1, // spsk
        nudler: 400, // g
        protein: 200, // g (tofu eller kylling)
        groentsager: 200, // g
        aeg: 4 // antal
    };

    // Event listener til "Ryd valg"-knappen:
    rydKnap.addEventListener('click', function() {
        // Find alle afkrydsningsfelter og radio-knapper i dropdown-menuerne
        const checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        
        // Gennemgå alle og fjern markeringen
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });

        // Find alle dropdown-knapper og nulstil deres tekst
        const dropdownButtons = document.querySelectorAll('.rullemenuknappe');
        dropdownButtons.forEach(function(button) {
            const originalText = button.getAttribute('data-oprindelig-tekst');
            if (originalText) {
                button.textContent = originalText; // Nulstil til oprindelig tekst
            }
        });

        // Kald eventuelt funktioner til at opdatere opskrift, ingredienser osv. efter nulstilling
        opdaterOpskrift();
        opdaterIngredienserOgFremgangsmaade();
    });

    // For at gemme den oprindelige knaptekst ved indlæsning af siden
    const dropdownButtons = document.querySelectorAll('.rullemenuknappe');
    dropdownButtons.forEach(function(button) {
        if (!button.getAttribute('data-oprindelig-tekst')) {
            button.setAttribute('data-oprindelig-tekst', button.textContent);
        }
    });

    // Matematik logik variabler til prisberegneren
    let quantity = parseInt(quantityElement.textContent); // Startantal
    let basePrice = 100; // Prisforøgelse/reduktion per enhed
    let totalPrice = basePrice * quantity; // Startpris (fx 300 kr ved quantity = 3)

    // Opdater prisen på siden
    function updatePrice() {
        priceElement.textContent = `Pris: ${totalPrice} kr`;
    }

    // Formindsk antal og pris når "-" knappen trykkes
    decreaseButton.addEventListener('click', function() {
        if (quantity > 1) { // Sørg for at antal ikke går under 1
            quantity--;
            totalPrice -= basePrice; // Træk 100 kr fra prisen
            quantityElement.textContent = quantity;
            updatePrice();
        }
    });

    // Forøg antal og pris når "+" knappen trykkes
    increaseButton.addEventListener('click', function() {
        quantity++;
        totalPrice += basePrice; // Læg 100 kr til prisen
        quantityElement.textContent = quantity;
        updatePrice();
    });

    // Opdater pris ved indlæsning af siden
    updatePrice();


    // Dropdown funktionalitet
    rullemenuer.forEach(rullemenu => {
        const knap = rullemenu.querySelector('.rullemenuknappe');
        const indhold = rullemenu.querySelector('.rullemenu-indhold');
        const afkrydsningsfelter = indhold.querySelectorAll('input[type="checkbox"]');

        // Vis/skjul dropdown-indhold når der klikkes på knappen
        knap.addEventListener('click', function(e) {
            e.preventDefault();
            indhold.style.display = indhold.style.display === 'block' ? 'none' : 'block';
        });

        // Lyt efter ændringer i afkrydsningsfelter og opdater knaptekst samt opskrift
        afkrydsningsfelter.forEach(afkrydsningsfelt => {
            afkrydsningsfelt.addEventListener('change', function() {
                opdaterKnapTekst(rullemenu);
                opdaterOpskrift();
                opdaterIngredienserOgFremgangsmaade();  // Opdater ingredienser og fremgangsmåde
            });
        });

        // Når der klikkes udenfor dropdown-menuerne, lukkes de
    document.addEventListener('click', function(event) {
        rullemenuer.forEach(function(rullemenu) {
            const knap = rullemenu.querySelector('.rullemenuknappe');
            const indhold = rullemenu.querySelector('.rullemenu-indhold');

            // Hvis der klikkes udenfor dropdown-menuen (ikke på knappen eller indholdet)
            if (!rullemenu.contains(event.target)) {
                indhold.style.display = 'none'; // Skjuler dropdown-listen
            }
        });
    });

    // Når knappen klikkes, viser/skjuler den dropdown-menuen
    rullemenuer.forEach(function(rullemenu) {
        const knap = rullemenu.querySelector('.rullemenuknappe');
        const indhold = rullemenu.querySelector('.rullemenu-indhold');

        knap.addEventListener('click', function(e) {
            e.preventDefault();
            indhold.style.display = indhold.style.display === 'block' ? 'none' : 'block';
        });
    });
    });

    // Opdater knaptekst baseret på valgte afkrydsningsfelter
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

    // Opdater opskriftsteksten baseret på brugerens valg
    function opdaterOpskrift() {
        const valgteAllergener = document.querySelectorAll('input[name="allergen"]:checked');
        const valgteIngredienser = document.querySelectorAll('input[name="ingredient"]:checked');
        const valgteDiæter = document.querySelectorAll('input[name="diet"]:checked');
        const valgteStørrelser = document.querySelectorAll('input[name="size"]:checked');

        let opskriftTekst = 'Denne opskrift er tilpasset dine præferencer.';

        // Allergener
        if (valgteAllergener.length > 0) {
            opskriftTekst += '\nAllergener undgået: ';
            valgteAllergener.forEach((element, index) => {
                opskriftTekst += (index > 0 ? ', ' : '') + element.value;
            });
        }

        // Ingredienser
        if (valgteIngredienser.length > 0) {
            opskriftTekst += '\nIngredienser fravalgt: ';
            valgteIngredienser.forEach((element, index) => {
                opskriftTekst += (index > 0 ? ', ' : '') + element.value;
            });
        }

        // Diæter
        if (valgteDiæter.length > 0) {
            opskriftTekst += '\nDiæter: ';
            valgteDiæter.forEach((element, index) => {
                opskriftTekst += (index > 0 ? ', ' : '') + element.value;
            });
        }

        // Størrelser
        if (valgteStørrelser.length > 0) {
            opskriftTekst += '\nPortionsstørrelse: ';
            valgteStørrelser.forEach((element, index) => {
                opskriftTekst += (index > 0 ? ', ' : '') + element.value;
            });
        }

        // Opdaterer opskriftsteksten på siden
        recipeTextElement.textContent = opskriftTekst;
    }

    // Funktion til at opdatere ingredienslisten baseret på størrelsen
    function opdaterIngrediensMaengder(portionsStoerrelse) {
        let factor = portionsStoerrelse / 400; // Grundlæggende faktor for portioner (400g er basis)
        
        ingredientsList.innerHTML = `
            <li>${(baseIngredients.fond * factor).toFixed(1)} liter grøntsags- eller kyllingefond</li>
            <li>${Math.ceil(baseIngredients.hvidlog * factor)} fed hvidløg, knust</li>
            <li>${Math.ceil(baseIngredients.ingefaer * factor)} cm ingefær, skåret i skiver</li>
            <li>${(baseIngredients.sojasauce * factor).toFixed(1)} spsk sojasauce (eller tamari for glutenfri)</li>
            <li>${(baseIngredients.sesamolie * factor).toFixed(1)} spsk sesamolie</li>
            <li>${Math.ceil(baseIngredients.nudler * factor)} g nudler (normale eller glutenfri)</li>
            <li>${Math.ceil(baseIngredients.protein * factor)} g tofu eller kylling (baseret på diætvalg)</li>
            <li>${Math.ceil(baseIngredients.groentsager * factor)} g blandede grøntsager (f.eks. spinat og shiitake)</li>
            <li>${Math.ceil(baseIngredients.aeg * factor)} æg (udelades ved vegansk valg)</li>
        `;
    }

    // Lyt efter ændringer i portionsstørrelse (radio-buttons)
    sizeRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            opdaterIngrediensMaengder(radio.value); // Opdater ingredienserne når størrelse ændres
        });
    });

    // Initial opdatering til standardværdien (400g)
    opdaterIngrediensMaengder(400);

    function opdaterIngredienserOgFremgangsmaade() {
        const valgteAllergener = document.querySelectorAll('input[name="allergen"]:checked');
        const valgteIngredienser = document.querySelectorAll('input[name="ingredient"]:checked');
        const valgteDiæter = document.querySelectorAll('input[name="diet"]:checked');
        
        // Standard (oprindelig) opskriftstekst
        let ingredientsHTML = `
            <li id="fond">2 liter grøntsags- eller kyllingefond</li>
            <li id="hvidlog">4 fed hvidløg, knust</li>
            <li id="ingefaer">1 stk. ingefær (ca. 5 cm), skåret i skiver</li>
            <li id="sojasauce">2 spsk. sojasauce (eller tamari for glutenfri)</li>
            <li id="sesamolie">1 spsk. sesamolie</li>
            <li id="nudler">400 g nudler (normale eller glutenfri)</li>
            <li id="protein">200 g tofu eller kylling (baseret på diætvalg)</li>
            <li id="groentsager">200 g blandede grøntsager (f.eks. spinat og shiitake)</li>
            <li id="aeg">4 æg (udelades ved vegansk valg)</li>
        `;
        
        let instructionsHTML = `
            <li>Bring fonden i kog sammen med hvidløg og ingefær. Lad det simre i 20 minutter.</li>
            <li>Tilsæt sojasauce (eller tamari for glutenfri) og sesamolie. Smag til og lad det simre i yderligere 5 minutter.</li>
            <li>Kog nudlerne efter anvisning på pakken (glutenfri hvis valgt).</li>
            <li>Kog æggene i 6-7 minutter for blødkogte (udelades ved vegansk).</li>
            <li>Steg tofu eller kylling, afhængigt af valg (udelades ved vegansk).</li>
            <li>Tilføj grøntsager (spinat og shiitake) lige før servering.</li>
            <li>Fordel nudlerne i skåle, hæld suppen over, og tilsæt topping efter diæt og præferencer.</li>
            <li>Server straks, mens retten er varm.</li>
        `;
    
        // Dynamisk fjern eller ændr ingredienser baseret på valgte allergener
        valgteAllergener.forEach((allergen) => {
            if (allergen.value === 'gluten') {
                // Fjern normale nudler og sojasauce hvis glutenallergen vælges
                ingredientsHTML = ingredientsHTML.replace('<li id="nudler">400 g nudler (normale eller glutenfri)</li>', '<li id="nudler">400 g glutenfri nudler</li>');
                instructionsHTML = instructionsHTML.replace('sojasauce', 'tamari (glutenfri sojasauce)');
            }
            if (allergen.value === 'laktose') {
                // Fjern opskriftselementer, der indeholder laktose (hvis nogen)
                ingredientsHTML = ingredientsHTML.replace('sesamolie', 'laktosefri olie');
            }
            if (allergen.value === 'nødder') {
                // Fjern nøddebaserede ingredienser
                ingredientsHTML = ingredientsHTML.replace('<li id="sesamolie">1 spsk. sesamolie</li>', '<li id="sesamolie">1 spsk. anden olie (uden nødder)</li>');
            }
            if (allergen.value === 'soya') {
                // Fjern sojasauce fra ingredienslisten
                ingredientsHTML = ingredientsHTML.replace('<li id="sojasauce">2 spsk. sojasauce (eller tamari for glutenfri)</li>', '');
            }
            if (allergen.value === 'skaldyr') {
                // Fjern skaldyrsrelaterede ingredienser (hvis nogen)
                ingredientsHTML = ingredientsHTML.replace('skaldyr', '');
            }
        });
    
        // Dynamisk fjern eller ændr ingredienser baseret på valgte ingredienser
        valgteIngredienser.forEach((ingredient) => {
            if (ingredient.value === 'nudler') {
                // Fjern nudler hvis valgt
                ingredientsHTML = ingredientsHTML.replace('<li id="nudler">400 g nudler (normale eller glutenfri)</li>', '');
            }
            if (ingredient.value === 'æg') {
                // Fjern æg hvis valgt
                ingredientsHTML = ingredientsHTML.replace('<li id="aeg">4 æg (udelades ved vegansk valg)</li>', '');
            }
            if (ingredient.value === 'grøntsager') {
                // Fjern grøntsager hvis valgt
                ingredientsHTML = ingredientsHTML.replace('<li id="groentsager">200 g blandede grøntsager (f.eks. spinat og shiitake)</li>', '');
            }
        });
    
        // Dynamisk opdater opskrift baseret på valgte diæter
        valgteDiæter.forEach((diet) => {
            if (diet.value === 'vegetar') {
                // Erstat kød med vegetarisk protein (f.eks. tofu)
                ingredientsHTML = ingredientsHTML.replace('kylling', 'tofu');
            }
            if (diet.value === 'vegansk') {
                // Fjern æg og kylling hvis vegansk diæt vælges
                ingredientsHTML = ingredientsHTML.replace('<li id="aeg">4 æg (udelades ved vegansk valg)</li>', '');
                ingredientsHTML = ingredientsHTML.replace('kylling', 'tofu');
            }
            if (diet.value === 'glutenfri') {
                // Erstat normale nudler med glutenfri nudler
                ingredientsHTML = ingredientsHTML.replace('normale nudler', 'glutenfri nudler');
            }
        });
    
        // Opdater HTML med de nye ingrediens- og instruktionstekster
        document.getElementById('ingredients-list').innerHTML = ingredientsHTML;
        document.getElementById('instructions-list').innerHTML = instructionsHTML;
    }            
});