const application = require('./packages/application/dist/index.js');
console.log('ObtenirFavorisDetailsUseCase:', application.ObtenirFavorisDetailsUseCase);
if (application.ObtenirFavorisDetailsUseCase) {
    try {
        new application.ObtenirFavorisDetailsUseCase();
        console.log('C\'est un constructeur !');
    } catch (e) {
        console.log('Ce n\'est PAS un constructeur ou manque d\'arguments:', e.message);
    }
} else {
    console.log('Non trouvé dans les exports.');
}
