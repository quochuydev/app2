import React, { Component } from 'react';
import 'isomorphic-fetch'

import Head from 'next/head'
import Link from 'next/link'

export default class App extends Component {
  static async getInitialProps({ query }) {
    let page = 1
    if (query.page != undefined && parseInt(query.page)) {
      page = query.page
    }

    let data = { "cards": [{ "id": "xy7-10", "name": "Vespiquen", "nationalPokedexNumber": 416, "imageUrl": "https://images.pokemontcg.io/xy7/10.png", "imageUrlHiRes": "https://images.pokemontcg.io/xy7/10_hires.png", "types": ["Grass"], "supertype": "Pokémon", "subtype": "Stage 1", "evolvesFrom": "Combee", "hp": "90", "number": "10", "artist": "kawayoo", "rarity": "Uncommon", "series": "XY", "set": "Ancient Origins", "setCode": "xy7", "attacks": [{ "cost": ["Colorless"], "name": "Intelligence Gathering", "text": "You may draw cards until you have 6 cards in your hand.", "damage": "10", "convertedEnergyCost": 1 }, { "cost": ["Colorless", "Colorless"], "name": "Bee Revenge", "text": "This attack does 10 more damage for each Pokémon in your discard pile.", "damage": "20+", "convertedEnergyCost": 2 }], "weaknesses": [{ "type": "Fire", "value": "×2" }] }, { "id": "dp6-90", "name": "Cubone", "nationalPokedexNumber": 104, "imageUrl": "https://images.pokemontcg.io/dp6/90.png", "imageUrlHiRes": "https://images.pokemontcg.io/dp6/90_hires.png", "types": ["Fighting"], "supertype": "Pokémon", "subtype": "Basic", "hp": "60", "retreatCost": ["Colorless"], "convertedRetreatCost": 1, "number": "90", "artist": "Kagemaru Himeno", "rarity": "Common", "series": "Diamond & Pearl", "set": "Legends Awakened", "setCode": "dp6", "attacks": [{ "cost": ["Colorless"], "name": "Headbutt", "text": "", "damage": "10", "convertedEnergyCost": 1 }, { "cost": ["Fighting", "Colorless"], "name": "Bonemerang", "text": "Flip 2 coins. This attack does 20 damage times the number of heads.", "damage": "20×", "convertedEnergyCost": 2 }], "resistances": [{ "type": "Lightning", "value": "-20" }], "weaknesses": [{ "type": "Water", "value": "+10" }] }, { "id": "ex14-85", "name": "Windstorm", "imageUrl": "https://images.pokemontcg.io/ex14/85.png", "imageUrlHiRes": "https://images.pokemontcg.io/ex14/85_hires.png", "supertype": "Trainer", "subtype": "Item", "hp": "None", "number": "85", "artist": "Ryo Ueda", "rarity": "Uncommon", "series": "EX", "set": "Crystal Guardians", "setCode": "ex14", "text": ["Choose up to 2 in any combination of Pokémon Tool cards and Stadium cards in play (both yours and your opponent's) and discard them."] }, { "id": "pl2-103", "name": "Alakazam 4", "nationalPokedexNumber": 65, "imageUrl": "https://images.pokemontcg.io/pl2/103.png", "imageUrlHiRes": "https://images.pokemontcg.io/pl2/103_hires.png", "types": ["Psychic"], "supertype": "Pokémon", "subtype": "Level Up", "ability": { "name": "Damage Switch", "text": "As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon SP to another of your Pokémon SP. This power can't be used if Alakazam 4 is affected by a Special Condition.", "type": "Poké-Power" }, "hp": "100", "retreatCost": ["Colorless", "Colorless"], "convertedRetreatCost": 2, "number": "103", "artist": "Ryo Ueda", "rarity": "Rare Holo Lv.X", "series": "Platinum", "set": "Rising Rivals", "setCode": "pl2", "text": ["Put this card onto your Active Alakazam 4. Alakazam 4 LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level."], "attacks": [{ "cost": ["Psychic", "Psychic", "Colorless"], "name": "Mind Shock", "text": "This attack's damage isn't affected by Weakness or Resistance.", "damage": "50", "convertedEnergyCost": 3 }], "weaknesses": [{ "type": "Psychic", "value": "×2" }] }, { "id": "ex8-100", "name": "Hariyama ex", "nationalPokedexNumber": 297, "imageUrl": "https://images.pokemontcg.io/ex8/100.png", "imageUrlHiRes": "https://images.pokemontcg.io/ex8/100_hires.png", "types": ["Fighting"], "supertype": "Pokémon", "subtype": "EX", "evolvesFrom": "Makuhita", "ability": { "name": "Commanding Aura", "text": "As long as Hariyama ex is your Active Pokémon, your opponent can't play any Stadium cards from his or her hand.", "type": "Poké-Body" }, "hp": "110", "retreatCost": ["Colorless", "Colorless"], "convertedRetreatCost": 2, "number": "100", "artist": "Ryo Ueda", "rarity": "Rare Holo EX", "series": "EX", "set": "Deoxys", "setCode": "ex8", "text": ["When Pokémon-ex has been Knocked Out, your opponent takes 2 Prize cards."], "attacks": [{ "cost": ["Fighting", "Colorless"], "name": "Knock Off", "text": "Choose 1 card from your opponent's hand without looking and discard it.", "damage": "40", "convertedEnergyCost": 2 }, { "cost": ["Fighting", "Fighting", "Colorless"], "name": "Pivot Throw", "text": "During your opponent's next turn, any damage done to Hariyama ex by attacks is increased by 10 (before applying Weakness and Resistance).", "damage": "80", "convertedEnergyCost": 3 }], "weaknesses": [{ "type": "Psychic", "value": "×2" }] }, { "id": "xy7-4", "name": "Bellossom", "nationalPokedexNumber": 182, "imageUrl": "https://images.pokemontcg.io/xy7/4.png", "imageUrlHiRes": "https://images.pokemontcg.io/xy7/4_hires.png", "types": ["Grass"], "supertype": "Pokémon", "subtype": "Stage 2", "evolvesFrom": "Gloom", "hp": "120", "retreatCost": ["Colorless"], "convertedRetreatCost": 1, "number": "4", "artist": "Mizue", "rarity": "Uncommon", "series": "XY", "set": "Ancient Origins", "setCode": "xy7", "attacks": [{ "cost": ["Grass"], "name": "Windmill", "text": "Switch this Pokémon with 1 of your Benched Pokémon.", "damage": "20", "convertedEnergyCost": 1 }, { "cost": ["Grass", "Colorless"], "name": "Flower Tornado", "text": "Move as many Grass Energy attached to your Pokémon to your other Pokémon in any way you like.", "damage": "60", "convertedEnergyCost": 2 }], "weaknesses": [{ "type": "Fire", "value": "×2" }] }, { "id": "ex16-1", "name": "Aggron", "nationalPokedexNumber": 306, "imageUrl": "https://images.pokemontcg.io/ex16/1.png", "imageUrlHiRes": "https://images.pokemontcg.io/ex16/1_hires.png", "types": ["Metal"], "supertype": "Pokémon", "subtype": "Stage 2", "evolvesFrom": "Lairon", "ability": { "name": "Terraforming", "text": "Once during your turn (before your attack), you may look at the top 5 cards from your deck and put them back on top of your deck in any order. This power can't be used if Aggron is affected by a Special Condition.", "type": "Poké-Power" }, "hp": "110", "retreatCost": ["Colorless", "Colorless", "Colorless", "Colorless"], "convertedRetreatCost": 4, "number": "1", "artist": "Ken Sugimori", "rarity": "Rare Holo", "series": "EX", "set": "Power Keepers", "setCode": "ex16", "attacks": [{ "cost": ["Colorless", "Colorless", "Colorless"], "name": "Metal Claw", "text": "", "damage": "50", "convertedEnergyCost": 3 }, { "cost": ["Metal", "Metal", "Colorless", "Colorless"], "name": "Mix-Up", "text": "Your opponent discards the top card of his or her deck.", "damage": "70", "convertedEnergyCost": 4 }], "resistances": [{ "type": "Grass", "value": "-30" }], "weaknesses": [{ "type": "Fire", "value": "×2" }] }, { "id": "xy11-41", "name": "Joltik", "nationalPokedexNumber": 595, "imageUrl": "https://images.pokemontcg.io/xy11/41.png", "imageUrlHiRes": "https://images.pokemontcg.io/xy11/41_hires.png", "types": ["Lightning"], "supertype": "Pokémon", "subtype": "Basic", "hp": "30", "number": "41", "artist": "Ayaka Yoshida", "rarity": "Common", "series": "XY", "set": "Steam Siege", "setCode": "xy11", "attacks": [{ "cost": ["Lightning"], "name": "Attach", "text": "", "damage": "10", "convertedEnergyCost": 1 }], "resistances": [{ "type": "Metal", "value": "-20" }], "weaknesses": [{ "type": "Fighting", "value": "×2" }] }, { "id": "pl2-104", "name": "Floatzel GL", "nationalPokedexNumber": 419, "imageUrl": "https://images.pokemontcg.io/pl2/104.png", "imageUrlHiRes": "https://images.pokemontcg.io/pl2/104_hires.png", "types": ["Water"], "supertype": "Pokémon", "subtype": "Level Up", "ability": { "name": "Water Rescue", "text": "Whenever any of your Water Pokémon (excluding any Floatzel GL) is Knocked Out by damage from your opponent's attack, you may put that Pokémon and all cards that were attached to it from your discard pile into your hand.", "type": "Poké-Body" }, "hp": "100", "number": "104", "artist": "Mitsuhiro Arita", "rarity": "Rare Holo Lv.X", "series": "Platinum", "set": "Rising Rivals", "setCode": "pl2", "text": ["Put this card onto your Active Floatzel GL. Floatzel GL LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level."], "attacks": [{ "cost": ["Water", "Water"], "name": "Energy Cyclone", "text": "Choose as many Energy cards from your hand as you like and show them to your opponent. This attack does 20 damage times the number of Energy cards you chose. Put those Energy cards on top of your deck. Shuffle your deck afterward.", "damage": "20×", "convertedEnergyCost": 2 }], "weaknesses": [{ "type": "Lightning", "value": "×2" }] }, { "id": "dp6-107", "name": "Misdreavus", "nationalPokedexNumber": 200, "imageUrl": "https://images.pokemontcg.io/dp6/107.png", "imageUrlHiRes": "https://images.pokemontcg.io/dp6/107_hires.png", "types": ["Psychic"], "supertype": "Pokémon", "subtype": "Basic", "hp": "60", "retreatCost": ["Colorless"], "convertedRetreatCost": 1, "number": "107", "artist": "Sumiyoshi Kizuki", "rarity": "Common", "series": "Diamond & Pearl", "set": "Legends Awakened", "setCode": "dp6", "attacks": [{ "cost": ["Free"], "name": "Show Off", "text": "Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.", "damage": "", "convertedEnergyCost": 0 }, { "cost": ["Psychic"], "name": "Payback", "text": "If your opponent has only 1 Prize card left, this attack does 10 damage plus 20 more damage.", "damage": "10+", "convertedEnergyCost": 1 }], "resistances": [{ "type": "Colorless", "value": "-20" }], "weaknesses": [{ "type": "Darkness", "value": "+10" }] }, { "id": "xy0-14", "name": "Greninja", "nationalPokedexNumber": 658, "imageUrl": "https://images.pokemontcg.io/xy0/14.png", "imageUrlHiRes": "https://images.pokemontcg.io/xy0/14_hires.png", "types": ["Water"], "supertype": "Pokémon", "subtype": "Stage 2", "evolvesFrom": "Frogadier", "hp": "140", "retreatCost": ["Colorless"], "convertedRetreatCost": 1, "number": "14", "artist": "5ban Graphics", "rarity": "", "series": "XY", "set": "Kalos Starter Set", "setCode": "xy0", "attacks": [{ "cost": ["Water"], "name": "Mat Block", "text": "Flip a coin. If heads, discard an Energy attached to your opponent's Active Pokémon.", "damage": "40", "convertedEnergyCost": 1 }, { "cost": ["Water", "Water", "Colorless"], "name": "Aqua Edge", "text": "", "damage": "80", "convertedEnergyCost": 3 }], "weaknesses": [{ "type": "Grass", "value": "×2" }] }, { "id": "xy0-15", "name": "Clauncher", "nationalPokedexNumber": 692, "imageUrl": "https://images.pokemontcg.io/xy0/15.png", "imageUrlHiRes": "https://images.pokemontcg.io/xy0/15_hires.png", "types": ["Water"], "supertype": "Pokémon", "subtype": "Basic", "hp": "70", "retreatCost": ["Colorless"], "convertedRetreatCost": 1, "number": "15", "artist": "5ban Graphics", "rarity": "", "series": "XY", "set": "Kalos Starter Set", "setCode": "xy0", "attacks": [{ "cost": ["Water", "Colorless"], "name": "Water Gun", "text": "", "damage": "20", "convertedEnergyCost": 2 }], "weaknesses": [{ "type": "Grass", "value": "×2" }] }] }
    data.page = page;
    return data;
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
        <div className="columns">
          {this
            .props
            .cards
            .map((card, i) => (
              <div className="col-md-3" key={i}>
                <div
                  style={{
                    margin: 10
                  }}>
                  <Link href={`/cards/${card.id}`}>
                    <img src={card.imageUrl} className="img-responsive" />
                  </Link>
                </div>
              </div>
            ))}

        </div>
        <div className="divider"></div>
        <div className="container">
          <div className="float-right">
            <ul className="pagination">
              <li
                className={"page-item" + (this.props.page == 1)
                  ? 'active'
                  : ''}>
                <Link href={`/?page=1`}>1</Link>
              </li>
              <li
                className={"page-item" + (this.props.page == 2)
                  ? 'active'
                  : ''}>
                <Link href={`/?page=2`}>2</Link>
              </li>
              <li
                className={"page-item" + (this.props.page == 3)
                  ? 'active'
                  : ''}>
                <Link href={`/?page=3`}>3</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}