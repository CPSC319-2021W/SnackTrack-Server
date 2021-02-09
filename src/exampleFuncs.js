/**
 * Code from https://github.com/bradtraversy/jest_testing_basics/blob/master/functions.test.js
 *
 */
const functions = {
    add: (num1, num2) => num1 + num2,
    isNull: () => null,
    checkValue: x => x,
    createUser: () => {
        const user = { firstName: 'Brad' };
        user['lastName'] = 'Traversy';
        return user;
    }
};

module.exports = functions;
