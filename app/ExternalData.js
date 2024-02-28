"use client";
import {scrapper} from './actions.js';
import externalDataStyles from './ExternalData.module.css';

import { useState,useRef } from "react";

export default function ExternalData({className}) {

    const [data, setData] = useState([]);
    const [aliasInit,setAliasInit] = useState('');
    const [bcDomainInit,setbcDomainInit] = useState('kosmosmusicru');

    const aliasInput = useRef();
    const bcDomainInput = useRef();
    
    function ExternalDataControls({className,inputAlias,inputbcDomain}) {
      
      const [alias, setAlias] = useState(inputAlias);
      const [bcDomain, setbcDomain] = useState(inputbcDomain);
      const [inputState, setInputState] = useState(false);
      const [inputText,setInputText] = useState('Go!');
      const [error, setError] = useState(false);
      
      async function getData() {
        setInputState(false);
        setInputText(`Fetching data from ${bcDomain}.bandcamp.com`);
        const responce = await scrapper(alias,bcDomain);
        setData(responce);
        setAliasInit(alias);
        setbcDomainInit(bcDomain);
        setInputState(true);
        setInputText("Go!");
      }

      function handleInput(e){
        if (e.target.dataset.alias)
          setAlias(e.target.value);
        if (e.target.dataset.bcdomain)
          setbcDomain(e.target.value);
        if ((aliasInput.current.value && bcDomainInput.current.value)) {
            ((aliasInput.current.value == aliasInit) && (bcDomainInput.current.value==bcDomainInit)) ? setInputText("Retry?"):setInputText("Go!");
            setError(false);
            setInputState(true);
        }
        else {
          setError("Invalid input");
          setInputState(false);
        }

      }
      
      if (!!error)
        return(
          <div className={className}>
          <input data-bcdomain ref={bcDomainInput} placeholder="Bandcamp domain" className="text-center block m-auto mb-5 rounded-md p-2 px-4" type="text" value={bcDomain} onChange={handleInput}></input>
          <input data-alias ref={aliasInput} placeholder="Artist alias..." className="text-center block m-auto mb-5 rounded-md p-2 px-4" type="text" value={alias} onChange={handleInput}></input>
         
          <button className="px-3 py-2 border-solid border-2 border-current rounded-md bg-gray-400 text-white"  disabled="">{error}</button>
          </div>
        )
      else return (
        <div className={className}>
          <input data-bcdomain ref={bcDomainInput} placeholder="Bandcamp domain" className="text-center block m-auto mb-5 rounded-md p-2 px-4" type="text" value={bcDomain} onChange={handleInput}></input>
          <input data-alias ref={aliasInput} placeholder="Artist alias..." className="text-center block m-auto mb-5 rounded-md p-2 px-4" type="text" value={alias} onChange={handleInput}></input>
          {!inputState ? <button className="px-3 py-2 border-solid border-2 border-current rounded-md bg-gray-400 text-white"  disabled="">{inputText}</button> : <button className="px-3 py-2 border-solid border-2 border-current rounded-md bg-sky-400 text-white" onClick={getData}>{inputText}</button> }

        </div>
      )
    }

    function ItemWrapper({className,children}) {
      return (
      <div className={className+" p-5"}>
        <div className={"w-full min-w-[170px] sm:min-w-0 max-w-[350px] mx-auto"}>{children}</div>
      </div>
      );
    }

    function ExternalDataContent({className, data}) {

      if (!!!data.length && !!aliasInit) 
        return (<div className={className + " flex flex-wrap place-content-center"}>{`No matches :(`}</div>)
      if (!!!data.length) {
        return(<div className={className + " flex flex-wrap place-content-center"}>{`Nothing here yet...`}</div>)
      }
        return (
          <div className={className + " flex flex-wrap justify-center"}>
          {data.map((src,index)=><ItemWrapper key={`item_${index}`} className={externalDataStyles.item}>
            <iframe className="w-full h-auto aspect-square" loading="lazy" src={src} seamless="" border="0" width="350" height="450"></iframe>
          </ItemWrapper>)}
        </div>
        )
    }
    return (
      <>
      <ExternalDataControls className="text-center my-4 mb-8" inputAlias={aliasInit} inputbcDomain={bcDomainInit}/>
      <ExternalDataContent id="iframes" className={className+" grow"} data={data}/>
      <div>Total: {data.length}</div>
      </>
    );
  }