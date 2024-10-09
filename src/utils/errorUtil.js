export const getErrorMessage = (err) => {
    switch (err.name){
        case 'ValidationError':
            return Object.values(err.errors)[0]?.message;
            default:
                return err.message;
    }
}

//by Tsvetan
// export const creatErrorMsg = (err) => {
//     switch (err.name) {
//         case 'ValidationError':
//             return Object.values(err.errors).map(err => err.message).join(', ');
//         case 'CastError':
//             return new Error('Please select Cast');
//         default:
//             return err.message;
//     }
// };