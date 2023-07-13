import {useState, useEffect } from 'react';
import fire from './fire.svg'
import wind from './wind.svg'
import emergency from './emergency.svg'
import tornado from './tornado.svg'
import styled from 'styled-components';

const Home = () => {

    const [disasters, setDisasters] = useState(null);
    

    useEffect(() => {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        if(day > 2){
            day = day - 2
        }
        else{
            if(month > 1){
                month = month - 1
                day = 30 + day
            }
            else{
                year = year - 1
                month = 12
                day = 30 + day
            }
        }
        if(month < 10){
            month = `0${month}`
        }
        if(day < 10){
            day = `0${day}` 
        }
        var today = `${year}-${month}-${day}T00:00:00.000Z`
        var array = []
        fetch(`https://www.fema.gov/api/open/v2//DisasterDeclarationsSummaries?$filter=lastRefresh%20gt%20%27${today}%27&$select=state,declarationType,designatedArea,incidentType,declarationDate,disasterNumber`)
            .then(res => res.json())  
            .then(data => {
                var dados = data.DisasterDeclarationsSummaries
                for(var i = 0; i < dados.length; i++){
                    var alreadyExists = false
                    for(var j = 0; j < array.length; j++){
                        if(dados[i].disasterNumber === array[j].id){
                            alreadyExists = true
                            var area = array[j].area
                            area.push(dados[i].designatedArea)
                            array[j].area = area
                            alreadyExists = true
                            if(!array[j].states.includes(dados[i].state)){
                                array[j].states.push(dados[i].state)
                            }
                            break;
                        }
                    }
                    if(!alreadyExists){
                        array.push({
                            id: dados[i].disasterNumber,
                            incidentType: dados[i].incidentType,
                            declarationDate: dados[i].declarationDate.split('T')[0].replace("Z", ""),
                            declarationType: dados[i].declarationType,
                            area: [dados[i].designatedArea],
                            states: [dados[i].state]
                        })
                    }
                }
            })
            .then(() => {   
                setDisasters(array)
                console.log(array)
            })
    }, []);

    return ( 
        <div className="home">
            {disasters && disasters.map(disaster => (
                <Box id={disaster.id} states={disaster.states} incidentType={disaster.incidentType} area={disaster.area} declarationDate={disaster.declarationDate} declarationType={disaster.declarationType}/>

                ))  
            }
        </div>
     );
}
 
const Box = (props) => {
    const BoxDiv = styled.div`

        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        position: relative;
        text-decoration: none;
        margin: 20px;
        width: 800px;
        padding: 20px;
        background-color: white;
        border-radius: 12px;
        top: 0;
        padding: 20px;
        box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
    `

    var declarationType = props.declarationType

    var image = "";

    if(declarationType === "EM") { declarationType = "Emergency"; image = emergency} 
    else if(declarationType === "FM") { declarationType = "Fire Management";  image = fire}
    else if(declarationType === "DR") { declarationType = "Disaster"; image = tornado}
    else if(declarationType === "FS") { declarationType = "Severe Storm"; image = wind}   


        const [showInfo, setShowInfo] = useState(false)

        return ( 
            <BoxDiv key={props.id} onClick={() => setShowInfo(!showInfo)}>
                <div className="line">
                    <img src={image} alt="" width='60px' style={{filter: 'invert(6%) sepia(55%) saturate(7496%) hue-rotate(301deg) brightness(90%) contrast(95%)'}}/>
                    <h1 style={{color:'#5A0B4D'}}>{ props.incidentType }</h1>
                    <div  style={{display: 'flex', width: '40%', flexDirection: 'row-reverse'}} className="states-dv">
                        { props.states.map(state => (
                                <p style={{marginLeft: '20px', color: "#9B287B"}}>{ state }</p>
                            ))  
                        }
                    </div>
                </div>

                <div className="line" style={{height: '50px'}}>
                    <p>{ declarationType }</p> 
                    <p>{ props.declarationDate }</p>
                </div>


                
                { showInfo && ( 
                    <h3 style={{margin: '10px'}}>Counties</h3>
                )}
                { showInfo && props.area.map(area => (
                        <p style={{marginLeft: '12px'}}>{ area.replace("(County)", "")}</p>
                    )) } 
                    

            </BoxDiv>
         );

}
export default Home;