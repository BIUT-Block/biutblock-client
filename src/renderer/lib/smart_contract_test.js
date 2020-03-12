function transfer(address, amount) {
    var transferFlag = false
    if(amount>0){
        transferFlag = true
    }
    return {'Address': address, 'Amount': amount, 'TransferFlag': transferFlag}
}

function lock(benefitAddress, amount, time){
    var lockFlag = false
    if(amount>0){
        lockFlag = true
    }
    return {'Address': benefitAddress, 'Amount': amount, 'Time': time, 'LockFlag': lockFlag}
}

function releaseLock(benefitAddress, amount){
    var releaseLockFlag = false
    if(amount>0){
        releaseLockFlag = true
    }
    return {'Address': benefitAddress, 'Amount': amount, 'ReleaseLockFlag': releaseLockFlag}
}