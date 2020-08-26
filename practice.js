function countingValleys(n, s) {
    let steps = s.split("");
    let valleyCount = 0;
    let currentSeaLevel = 0;
    let valleyStatus = false;
    [...s].forEach(step => {
      step === 'U' ? currentSeaLevel++ : currentSeaLevel--;
        if(currentSeaLevel < 0 && !valleyStatus) {
          valleyCount++;
          valleyStatus = true
          console.log('here')
        } else if(currentSeaLevel >= 0 && valleyStatus) {
          valleyStatus= false
          console.log('there')
        }
      })
      return valleyCount;
    }

console.log(countingValleys(8,'DUDDUUDUDUUUDUUUDDDD'));