import React, { useState } from 'react';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Chip, IconButton } from '@material-ui/core/';

import { Sun, Moon } from 'react-feather';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      background:'linear-gradient(35deg,#fb6340,#fbb140)!important'
    },
    network: {

    }
  }),
);


export default function SideBar(props: any) {
  const [darkMode, toggleDarkMode] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [networkId, setNetworkId] = useState<string | null>(null);

  const switchTheme = () => {
    let theme = localStorage.getItem('theme')
    if (theme) {
      localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light')
    } else {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }
    
    toggleDarkMode(!darkMode)
    window.location.reload()
  }

  const classes = useStyles();

  const loadBlockChainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccounts(accounts[0])

    const networkId = await web3.eth.net.getId()

    let chainData = await (await fetch('https://chainid.network/chains.json')).json()

    let network = 'unknown';
    network = chainData.find((chain: any) => chain.networkId === networkId)

    switch(networkId) {
      case 1:
        network = 'mainNet';
        break;
      case 3:
        network = 'ropsten';
        break;
      case 4:
        network = 'rinkeby';
        break;
      case 42:
        network = 'kovan';
        break;
      case 5:
        network = 'goerli';
        break;
      default:
        network = 'unknown'
    }
    setNetworkId(network)
  }

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{display: 'flex'}}>
          {/* <Chip
          style={{ marginLeft: '7px'}}
          size="small"
          label='Goerli'
          className={classes.network}
          /> */}
          <div style={{marginRight:'15px'}}>
            <p style={{whiteSpace:'nowrap', textTransform:'uppercase', marginBottom:'4px',marginTop:'4px'}}>Node Network</p>
            <span>Goerli</span>
          </div>
          <div>
            <p style={{whiteSpace:'nowrap', textTransform:'uppercase', marginBottom:'4px',marginTop:'4px'}}>Wallet Network</p>
            <span>{networkId}</span>
          </div>
          <div style={{width:'100%'}}>
            <div style={{float:'right'}} >
              <IconButton style={{marginRight:'10px'}} aria-label="dark-mode" onClick={() => switchTheme()}>
                {props.themeMode === 'dark' ?
                <Moon />
                :
                <Sun />
                }
              </IconButton>
              <Chip 
              label="Connect Wallet"
              color="primary"
              onClick={() => loadBlockChainData()}
              />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
