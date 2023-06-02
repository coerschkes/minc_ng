import { Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { ApiStateService } from './api-state.service';

const baseApiUrl = 'https://api.guildwars2.com/v2/';

@Injectable({ providedIn: 'root' })
export class ApiUrlBuilderService {
  constructor(private apiState: ApiStateService) {}

  get account(): Observable<string> {
    return this.constructUrl('account');
  }

  get tokenInfo(): Observable<string> {
    return this.constructUrl('tokeninfo');
  }

  private constructUrl(endpoint: string): Observable<string> {
    return this.apiState.apiKey.pipe(
      take(1),
      map((apiKey) => baseApiUrl + endpoint + '?access_token=' + apiKey)
    );
  }
  // + account: Returns information about an account associated with an API key.
  // account/bank: Returns information about a bank associated with an API key.
  // account/inventory: Returns information about the shared inventory slots associated with an API key.
  // account/wallet: Returns information about wealth associated with an API key.
  // characters: Returns information on an account's characters.
  // pvp/stats: Returns general information on a player's performance in sPvP.
  // pvp/games: Returns more detailed information on the player's most recent sPvP matches.
  // pvp/standings: Returns the best and current standing of a player in sPvP leagues.
  // + tokeninfo: Returns information about the supplied API Key.
  //
  // professions: Returns information about professions.
  // specializations: Returns information about specializations.
  // skills: Returns information about skills.
  // traits: Returns information about traits.
  // legends: Returns information about revenant legends.
  //
  // guild/:id: Returns core details about a given guild.
  // emblem: Returns image resources needed to render guild emblems.
  // guild/permissions: Returns information about guild rank permissions.
  // guild/search: Returns information on guild ids to be used for other API queries.
  //
  // guild/:id/log: Returns information about a guild's event log.
  // guild/:id/members: Returns information about members of a guild.
  // guild/:id/ranks: Returns information about the permission ranks of a guild.
  //
  // items: Returns information about items.
  // itemstats: Returns information about item stats.
  // materials: Returns information about materials.
  // pvp/amulets: Returns information about pvp amulets.
  //
  // build: Returns the current build id.
  // currencies: Returns information about wallet currencies.
  // files: Returns commonly requested assets.
  // quaggans: Returns quaggan icons.
  // worlds: Returns world names.
  //
  // wvw: Returns information about the v2/wvw endpoints.
  // wvw/matches: Returns information about current WvW matchups.
}
