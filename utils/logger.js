const info = (...params) => {
    let toLog = ['Info', `[${new Date().toString()}]`, ...params];
    console.log(...toLog);
};

const error = (...params) => {
    let toLog = ['Error', `[${new Date().toString()}]`, ...params];
    console.log(...toLog);
};

module.exports = {
    info, error
};