import { COMMON } from './common.js';
import { SybConfigApp } from './modules/apps/config-app.js';

/* CONFIG class for syb5e data.
 * Stored in 'game.syb5e.CONFIG'
 */
export class SYB5E {
  static NAME = 'SYB5E_CONFIG';

  static register() {
    this.globals();
    this.templates();
    this.settings();
    this.hooks();
  }

  static get CONFIG() {
    return globalThis.game.syb5e.CONFIG;
  }

  static templates() {
    return loadTemplates([
      /* Actor partials */
      `${COMMON.DATA.path}/templates/actors/parts/actor-corruption.html`,
      `${COMMON.DATA.path}/templates/actors/parts/actor-shadow.html`,
      `${COMMON.DATA.path}/templates/actors/parts/npc-manner.html`,
      `${COMMON.DATA.path}/templates/actors/parts/actor-currency.html`,

      /* Item partials */
      `${COMMON.DATA.path}/templates/items/parts/spell-favored.html`,
      `${COMMON.DATA.path}/templates/items/parts/armor-properties.html`,

      /* App partials */
      `${COMMON.DATA.path}/templates/apps/rest.html`,
    ]);
  }

  /* registering our settings */
  static settings() {
    const settingsData = {
      charBGChoice: {
        restricted: false,
        type: String,
        config: false,
        scope: 'client',
        default: 'url(../images/background/bg-green.webp) repeat',
      },
      charTextColour: {
        restricted: false,
        type: String,
        config: false,
        scope: 'client',
        default: '#ffffff',
      },
      npcBGChoice: {
        restricted: false,
        type: String,
        config: false,
        scope: 'client',
        default: 'url(../images/background/bg-green.webp) repeat',
      },
      switchCharBGColour: {
        restricted: false,
        type: String,
        config: false,
        scope: 'client',
        default: 'url(../images/background/bg-green.webp) repeat',
      },
      switchNpcBGColour: {
        restricted: false,
        type: String,
        config: false,
        scope: 'client',
        default: 'url(../images/background/bg-red.webp) repeat',
      },
      npcTextColour: {
        restricted: false,
        type: String,
        config: false,
        scope: 'client',
        default: '#ffffff',
      },
      fontFamily: {
        restricted: false,
        type: String,
        config: false,
        scope: 'client',
        default: 'Fondamento',
      },
      // addMenuButton: {
      //   scope: 'world',
      //   config: true,
      //   default: SybConfigApp.getDefaults.addMenuButton,
      //   type: Boolean,
      //   onChange: (enabled) => {
      //     SybConfigApp.toggleConfigButton(enabled);
      //   },
      // },
    };

    game.settings.registerMenu('symbaroum5ecore', 'symbaroumSettings', {
      name: 'SYB5E.setting.config-menu-label.name',
      label: 'SYB5E.setting.config-menu-label.name',
      hint: 'SYB5E.setting.config-menu-hint.hint',
      icon: 'fas fa-palette',
      type: SybConfigApp,
      restricted: false,
    });

    COMMON.applySettings(settingsData);
  }

  static hooks() {
    Hooks.once('ready', async () => {
      /* setup config options */
      let r = document.querySelector(':root');
      await r.style.setProperty('--syb5e-pc-background-image', COMMON.setting('switchCharBGColour'));
      await r.style.setProperty('--syb5e-pc-color', COMMON.setting('charTextColour'));
      await r.style.setProperty('--syb5e-npc-background-image', COMMON.setting('switchNpcBGColour'));
      await r.style.setProperty('--syb5e-npc-color', COMMON.setting('npcTextColour'));
      await r.style.setProperty('--syb5e-pc-font', COMMON.setting('fontFamily'));
      await r.style.setProperty('--syb5e-npc-font', COMMON.setting('fontFamily'));
    });
  }

  /* setting our global config data */
  static globals() {
    globalThis.game.syb5e.CONFIG = {};

    /* Spell Level translations (unfortunately dnd5e does not provide these) */
    globalThis.game.syb5e.CONFIG.LEVEL_SHORT = [
      'SYB5E.Level.Zeroth',
      'SYB5E.Level.First',
      'SYB5E.Level.Second',
      'SYB5E.Level.Third',
      'SYB5E.Level.Fourth',
      'SYB5E.Level.Fifth',
      'SYB5E.Level.Sixth',
      'SYB5E.Level.Seventh',
      'SYB5E.Level.Eighth',
      'SYB5E.Level.Nineth',
    ];

    /* 3 rest types for syb */
    globalThis.game.syb5e.CONFIG.REST_TYPES = {
      short: 'short',
      long: 'long',
      extended: 'ext',
    };

    globalThis.game.dnd5e.config.limitedUsePeriods.er = COMMON.localize('SYB5E.Rest.Extended');

    /* Add in "Greater Artifact" rarity for items */
    globalThis.game.dnd5e.config.itemRarity.greaterArtifact = COMMON.localize('SYB5E.Item.Rarity.GreaterArtifact');

    /* Add in "Alchemical Weapon" category for weapons */
    globalThis.game.dnd5e.config.weaponTypes.alchemical = COMMON.localize('SYB5E.Item.Subtype.Alchemical');

    /* Add in "Alchemical" as a weapon proficiency */
    globalThis.game.dnd5e.config.weaponProficiencies.alc = COMMON.localize('SYB5E.Proficiency.WeaponAlchemical');

    /* Map the weapon type key (alchemical) to the proficiency key (alc) */
    globalThis.game.dnd5e.config.weaponProficienciesMap.alchemical = 'alc';

    /* Extend dnd5e weapon properties */
    mergeObject(
      globalThis.game.dnd5e.config.weaponProperties,
      COMMON.translateObject({
        are: 'SYB5E.Item.WeaponProps.AreaEffect',
        bal: 'SYB5E.Item.WeaponProps.Balanced',
        crw: 'SYB5E.Item.WeaponProps.Crewed',
        con: 'SYB5E.Item.WeaponProps.Concealed',
        dim: 'SYB5E.Item.WeaponProps.DeepImpact',
        ens: 'SYB5E.Item.WeaponProps.Ensnaring',
        imm: 'SYB5E.Item.WeaponProps.Immobile',
        msv: 'SYB5E.Item.WeaponProps.Massive',
        res: 'SYB5E.Item.WeaponProps.Restraining',
        sge: 'SYB5E.Item.WeaponProps.Siege',
      })
    );

    /* extend dnd5e damage types
     * -> This supports both the damage and healing types
     */
    mergeObject(
      globalThis.game.dnd5e.config.damageTypes,
      COMMON.translateObject({
        permc: 'SYB5E.Corruption.PermDamage',
        tempc: 'SYB5E.Corruption.TempDamage',
      })
    );

    /* add in "None" spell school (mainly for Troll Singer Songs) */
    mergeObject(
      globalThis.game.dnd5e.config.spellSchools,
      COMMON.translateObject({
        non: 'None',
      })
    );

    /* Store new armor properties */
    globalThis.game.syb5e.CONFIG.ARMOR_PROPS = COMMON.translateObject({
      con: 'SYB5E.Item.ArmorProps.Concealable',
      cmb: 'SYB5E.Item.ArmorProps.Cumbersome',
      noi: 'SYB5E.Item.ArmorProps.Noisy',
      wei: 'SYB5E.Item.ArmorProps.Weighty',
    });

    /* add 'abomination' and 'phenomenon' to creature types */
    mergeObject(
      globalThis.game.dnd5e.config.creatureTypes,
      COMMON.translateObject({
        abomination: 'SYB5E.Creature.Abomination',
        phenomenon: 'SYB5E.Creature.Phenomenon',
      })
    );

    /* Replace currency names */
    globalThis.game.syb5e.CONFIG.CURRENCY = COMMON.translateObject({
      gp: 'SYB5E.Currency.Thaler',
      sp: 'SYB5E.Currency.Shilling',
      cp: 'SYB5E.Currency.Orteg',
    });

    /* redefine used currencies (only cp, sp, gp) */
    globalThis.game.syb5e.CONFIG.CURRENCY_CONVERSION = {
      cp: { into: 'sp', each: 10 },
      sp: { into: 'gp', each: 10 },
      gp: { into: 'gp', each: 1 },
    };

    /* The default values for syb5e actor data */
    globalThis.game.syb5e.CONFIG.DEFAULT_FLAGS = {
      corruption: {
        ability: 'cha',
        temp: 0,
        permanent: 0,
        value: 0,
        max: 0,
      },
      manner: '',
      shadow: '',
    };

    /* The default values for syb5e item data */
    globalThis.game.syb5e.CONFIG.DEFAULT_ITEM = {
      favored: 0,
      armorProps: Object.keys(game.syb5e.CONFIG.ARMOR_PROPS).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      corruptionOverride: {
        type: 'none',
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM, //custom = use stock items values (i.e. "none")
        value: '0',
      },
    };

    const root = `flags.${COMMON.DATA.name}`;

    /* paths for syb flag data */
    globalThis.game.syb5e.CONFIG.PATHS = {
      root,
      corruption: {
        root: `${root}.corruption`,
        ability: `${root}.corruption.ability`,
        temp: `${root}.corruption.temp`,
        permanent: `${root}.corruption.permanent`,
        value: undefined, //getter only for actors
        max: `${root}.corruption.max`,
      },
      corruptionOverride: {
        root: `${root}.corruptionOverride`,
        type: `${root}.corruptionOverride.type`,
        value: `${root}.corruptionOverride.value`, //getter only for actors
        mode: `${root}.corruptionOverride.mode`, //for custom corruption items
      },
      manner: `${root}.manner`,
      shadow: `${root}.shadow`,
      favored: `${root}.favored`,
      armorProps: `${root}.armorProps`,
      sybSoulless: {
        dataPath: `flags.dnd5e.sybSoulless`,
        scope: 'dnd5e',
        key: 'sybSoulless',
      },
    };

    globalThis.game.syb5e.CONFIG.SPELL_PROGRESSION = {
      none: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      full: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 9],
      half: [0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    };

    CONFIG.DND5E.characterFlags.sybSoulless = {
      hint: 'SYB5E.Sheet.Soulless.Hint',
      name: 'SYB5E.Sheet.Soulless.Name',
      section: 'DND5E.RacialTraits',
      type: Boolean,
    };
  }
}
