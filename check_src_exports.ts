import * as application from './packages/application/src/index';
console.log('ObtenirFavorisDetailsUseCase:', application.ObtenirFavorisDetailsUseCase);
if (application.ObtenirFavorisDetailsUseCase) {
    console.log('C\'est présent dans le src !');
} else {
    console.log('Non trouvé dans le src/index.ts.');
}
