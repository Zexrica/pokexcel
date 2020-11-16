var pokepasteArray = [];

var loadHtml = function (path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return;
        callback(this.responseText);
    };
    xhr.send();
};

var displayHtml = function () {
    // Get input box and assign the content to an array
    formValue = document.getElementById('inputForm').value;
    console.log(formValue)
    formValue = formValue.split(" ");
    pokepasteArray.push(formValue);
    console.log(pokepasteArray);

    var dataArray = [];
    for (let index = 0; index < pokepasteArray.length; index++) {
        loadHtml(pokepasteArray[index], function (html) {
            document.querySelector('.page_content_wrapper').innerHTML = html;

            const pokemon = document.querySelector('.page_content_wrapper').getElementsByTagName('pre');

            for (let index2 = 0; index2 < pokemon.length; index2++) {
                pokemonText = pokemon[index2].innerText;

                const nl1 = pokemonText.indexOf('\n'); // After this: ability
                const nl2 = pokemonText.indexOf('\n', nl1 + 1); // After this: level
                const nl3 = pokemonText.indexOf('\n', nl2 + 1); // After this: EVs
                const nl4 = pokemonText.indexOf('\n', nl3 + 1); // After this: Nature
                const nl5 = pokemonText.indexOf('\n', nl4 + 1); // After this: IVs
                const nl6 = pokemonText.indexOf('\n', nl5 + 1); // After this: Move 1
                const nl7 = pokemonText.indexOf('\n', nl6 + 1); // After this: Move 2
                const nl8 = pokemonText.indexOf('\n', nl7 + 1); // After this: Move 3
                const nl9 = pokemonText.indexOf('\n', nl8 + 1); // After this: Move 4

                // Seperate name from item
                const endName = pokemonText.search('@') - 1;
                let name = pokemonText.slice(0, endName);
                // No more gender
                name = name.replace(' (M)', '');
                name = name.replace(' (F)', '');

                const beginItem = pokemonText.search('@') + 2;
                const item = pokemonText.slice(beginItem, nl1 - 2);

                const ability = pokemonText.slice(nl1 + 'Ability'.length + 3, nl2 - 2);

                const endNature = pokemonText.search('Nature') - 1;
                const nature = pokemonText.slice(nl4 + 1, endNature);

                let move1;
                let move2;
                let move3;
                let move4;

                // Check for non-31 IVs then seperate moves accordingly
                if (pokemonText.charAt(nl5 + 1) == "I") {
                    move1 = pokemonText.slice(nl6 + 3, nl7 - 2);
                    move2 = pokemonText.slice(nl7 + 3, nl8 - 2);
                    move3 = pokemonText.slice(nl8 + 3, nl9 - 2);
                    move4 = pokemonText.slice(nl9 + 3, pokemonText.length - 4);
                } else {
                    move1 = pokemonText.slice(nl5 + 3, nl6 - 2);
                    move2 = pokemonText.slice(nl6 + 3, nl7 - 2);
                    move3 = pokemonText.slice(nl7 + 3, nl8 - 2);
                    move4 = pokemonText.slice(nl8 + 3, pokemonText.length - 4);
                };
                dataArray[index2 + (index * 6)] = [name, item, ability, nature, move1, move2, move3, move4];
            };

            if (index == pokepasteArray.length - 1) {
                console.log(dataArray)
                export_csv(arrayHeader, dataArray, ',', 'Teams');
            };
        });
    };
    return false;
};

const arrayHeader = ["Pokemon", "item", "ability", "nature", "move1", "move2", "move3", "move4"];

const export_csv = (arrayHeader, dataArray, delimiter, fileName) => {
    let header = arrayHeader.join(delimiter) + '\n';
    let csv = header;
    dataArray.forEach(array => {
        csv += array.join(delimiter) + "\n";
    });

    let csvData = new Blob([csv], { type: 'text/csv' });
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
};
