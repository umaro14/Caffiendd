
import { useState } from "react"
import { coffeeOptions } from "../utils" 
import Authentication from "./Authentication";
import Modal from "./Modal";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";


export default function CoffeeForm(props){
    const {isAuthenticated} = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedCoffee, setSelectedCoffee] = useState(null);
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
    const [coffeeCost, setCofeeCost] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);

    const { globalData, setGlobalData, globalUser } = useAuth();

    async function handleSubmitForm(){
        if(!isAuthenticated){
            setShowModal(true);
            return
        }

        //define a guarad clause that only submits the form if it is completed
          if(!selectedCoffee){ 
            return 
          }

         try {
              //if that true then we are going to create a new data object
            const newGlobalData = {
              ...( globalData || {}) //if the global data is null then give an empty object
            };

            const nowTime = Date.now();
            const timeToSubstract = (hour * 60 * 60 * 1000) + (min * 60 * 100);
            const timeStamp = nowTime - timeToSubstract;

            const newData = {
              name: selectedCoffee,
              cost: coffeeCost
            };
            newGlobalData[timeStamp] = newData;
            console.log(timeStamp,selectedCoffee, coffeeCost);
            
            //then update the global state
            setGlobalData(newGlobalData);

            //and persist the data in firebase firestore
            const userRef = doc(db, 'users', globalUser.uid);
            const res = await setDoc(userRef, {
              [timeStamp]: newData
            }, {merge: true});        //we passed this object as a secondary argument so intead of fire overriding our database it will just merge it
            
         } catch (err) {
            console.log(err.message)
         }
            setSelectedCoffee(null);
            setCofeeCost(0);
            setHour(0);
            setMin(0);
    };

    function handleCloseModal(){
      setShowModal(false)
    };


    return(
        <>
          {showModal &&(
                <Modal handleCloseModal={handleCloseModal}>
                    <Authentication handleCloseModal={handleCloseModal}/>
                </Modal>
          )}
          <div className="section-header">
            <i className="fa-solid fa-pencil" />
            <h2>Start Tracking Today</h2>
          </div>
          <h4>Select Coffee type</h4>
          <div className="coffee-grid">
            {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
                return (
                    <button key={optionIndex} onClick={() => {
                        setSelectedCoffee(option.name)
                        setShowCoffeeTypes(false)
                    }}
                    className={"button-card " + (option.name === selectedCoffee ? "coffee-button-selected" : "")} 
                    >
                      <h4>{option.name}</h4>
                      <p>{option.caffeine} mg</p>
                    </button>
                )
            })}
            <button onClick={() => {
                 setShowCoffeeTypes(true)
                 setSelectedCoffee(null); {/*this resets the border for the primary 5 types */}
                 }}
                 className={"button-card " + (showCoffeeTypes ? "coffee-button-selected" : "")}>
                 <h4>Other</h4>
                 <p>n/a</p>
            </button>
          </div>
          {/*only displays the list of the coffee types if showCoffee is true, which is true only when the "other" button is clicked*/}
          {showCoffeeTypes && (
             <select id="coffee-list" name="coffee-list" onChange={(e) => {
                setSelectedCoffee(e.target.value)
             }}>
             <option value={null}>Select type</option>
             {coffeeOptions.map((option, optionIndex) =>{
             return (
                <option value={option.name} key={optionIndex}>
                {option.name} ({option.caffeine}mg)
                </option>
              )
             })}
           </select>
         )}
          <h4>Add the cost ($)</h4>
          <input className="w-full" type="number" value={coffeeCost} placeholder="4.50" min={0} onChange={(e) => {
            setCofeeCost(e.target.value)
          }}/>
          <h4>Time since consumption</h4>
          <div className="time-entry">
            <div>
               <h6>Hours</h6>
               <select id="hours-select" onChange={(e) => {
                setHour(e.target.value)
               }}>
                  //custom array, it does not exist anywhere
                 {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((hour, hourIndex) => {
                    return (
                        <option key={hourIndex} value={hour}>{hour}</option>
                    )
                 })}
               </select>
            </div>
            <div>
               <h6>Mins</h6>
               <select id="mins-select" onChange={(e) => {
                setMin(e.target.value)
               }}>
                  //custom array, it does not exist anywhere
                 {[0,5,10,15,30,45].map((min, minIndex) => {
                    return (
                        <option key={minIndex} value={min}>{min}</option>
                    )
                 })}
               </select>
            </div>
          </div>
          <button onClick={handleSubmitForm}>Add Entry</button>
        </>
    )
}