// REAL LIFE EXAMPLE: Pagkadto sa Eskwelahan
//
// Kung adlaw sang klase kag may allowance,
// tan-awon ko kung may gasolina ang motor.
//
// - Kung may gasolina -> masulod ko sakay motor.
// - Kung wala gasolina pero may plete -> masulod ko sakay jeep.
// - Kung wala gasolina kag wala plete -> indi ko kasulod.
//
// Pero kung wala allowance,
// indi gid ko kasulod.
//
// Kung wala klase,
// mapabilin lang ko sa balay.
//

function schoolDay() {
    let mayKlase = true;
    let mayAllowance = true;
    let mayGasolina = false;
    let mayPlete = true;

    if (mayKlase) {

        if (mayAllowance) {

            if (mayGasolina) {
                console.log("Masulod ko sakay sang motor.");
            } else if (mayPlete) {
                console.log("Masulod ko sakay sang jeep.");
            } else {
                console.log("Indi ko kasulod kay wala gasolina kag wala plete.");
            }

        } else {
            console.log("Indi ko kasulod kay wala allowance.");
        }

    } else {
        console.log("Wala klase subong. Pahuway lang anay.");
    }
}

schoolDay();