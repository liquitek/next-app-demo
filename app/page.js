import ExternalData from './ExternalData.js';

import externalDataStyles from './ExternalData.module.css';
function Section(props) {
  return (<section className={props.className}>{props.children}</section>);
}



export default function Home() {

  
  return (
    <Section className="grow flex flex-col">
      <ExternalData className={externalDataStyles.container}/>
    </Section>
    
  );
}