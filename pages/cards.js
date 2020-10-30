import React from 'react'
import 'isomorphic-fetch'

import Head from 'next/head'
import Link from 'next/link'
export default class App extends React.Component {
  static async getInitialProps({ query }) {
    const data = { "card": { "id": "xy7-10", "name": "Vespiquen", "nationalPokedexNumber": 416, "imageUrl": "https://images.pokemontcg.io/xy7/10.png", "imageUrlHiRes": "https://images.pokemontcg.io/xy7/10_hires.png", "types": ["Grass"], "supertype": "Pokémon", "subtype": "Stage 1", "evolvesFrom": "Combee", "hp": "90", "number": "10", "artist": "kawayoo", "rarity": "Uncommon", "series": "XY", "set": "Ancient Origins", "setCode": "xy7", "attacks": [{ "cost": ["Colorless"], "name": "Intelligence Gathering", "text": "You may draw cards until you have 6 cards in your hand.", "damage": "10", "convertedEnergyCost": 1 }, { "cost": ["Colorless", "Colorless"], "name": "Bee Revenge", "text": "This attack does 10 more damage for each Pokémon in your discard pile.", "damage": "20+", "convertedEnergyCost": 2 }], "weaknesses": [{ "type": "Fire", "value": "×2" }] } }
    return data
  }
  render() {
    return (
      <div className="container">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="//cdn.bootcss.com/spectre.css/0.1.29/spectre.min.css" />
        </Head>
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            {this.props.card.name}
          </li>
        </ul>
        <div className="columns">
          <div className="column col-4">
            <p><img src={this.props.card.imageUrl} /></p>
          </div>
          <div className="column col-8 empty">
            <div className="form-horizontal">
              <div className="form-group">
                <div className="col-3">
                  <label className="form-label">Name</label>
                </div>
                <div className="col-9">
                  <span>{this.props.card.name}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-3">
                  <label className="form-label">HP</label>
                </div>
                <div className="col-9">
                  <span>{this.props.card.hp}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-3">
                  <label className="form-label">Series</label>
                </div>
                <div className="col-9">
                  <span>{this.props.card.series}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-3">
                  <label className="form-label">Set</label>
                </div>
                <div className="col-9">
                  <span>{this.props.card.set}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    )
  }
}