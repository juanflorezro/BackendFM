const limpiarValorMonetario = (valor) => {
    valor=valor+''
    if (valor === undefined || valor === null) {
        return 0
    }
    return parseFloat(valor.replace(/[^0-9.-]+/g, "")) || 0
}

module.exports = limpiarValorMonetario
