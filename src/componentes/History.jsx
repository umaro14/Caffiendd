import { useAuth } from "../context/AuthContext";
import { calculateCurrentCaffeineLevel, coffeeConsumptionHistory, coffeeOptions, getCaffeineAmount, timeSinceConsumption } from "../utils";

export default function History(){
  const {globalData} = useAuth();
    return(
        <>
          <div className="section-header"> 
            <i className="fa-solid fa-timeline"></i>
            <h2>History</h2> 
          </div>
          <p><i>Hover for more information!</i></p>
          <div className="coffee-history">
            {Object.keys(globalData).sort((a, b) => b - a).map((utcTime, coffeeIndex) => {
                const coffee = globalData[utcTime];      {/*utcTime from the coffeeConsumptionHistory [e.g '1727579064032'] */}
                const timeSinceConsume = timeSinceConsumption(utcTime); {/*function from the utils that calculates the data/time*/}
                const originalAmount = getCaffeineAmount(coffee.name);  {/*function from the utils that calculates the caffeine amount */}

                {/*utcTime:"1727616747401" and coffee: { "name": "Americano", "cost": 5.52 }  */}
                const remainingAmount = calculateCurrentCaffeineLevel({[utcTime]: coffee});

                const summary = `${coffee.name} | ${timeSinceConsume} | £${coffee.cost} | ${remainingAmount}mg / ${originalAmount}mg`

                return(
                    <div title={summary} key={coffeeIndex}>
                      <i className="fa-solid fa-mug-hot" />
                    </div>
                ) 
            })}
          </div>
        </>
    )
}