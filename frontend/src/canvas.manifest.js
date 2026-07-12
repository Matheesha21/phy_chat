export const manifest = {
  screens: {
    scr_n8cfza: { name: "Chat", route: "/", position: {"x":160,"y":1820} },
    scr_v2af1y: { name: "Choose study year", route: "/competitions", position: {"x":160,"y":3800} },
    scr_woacsg: { name: "Choose modules", route: "/competitions", state: {"step":"modules","selectedYear":2}, position: {"x":1560,"y":3800} },
    scr_c4reer: { name: "Choose career path", route: "/competitions", state: {"step":"career","selectedYear":2}, position: {"x":2960,"y":3800} },
    scr_w314tv: { name: "Quiz", route: "/competitions", state: {"step":"quiz","selectedYear":2}, position: {"x":4360,"y":3800} },
    scr_e39rzb: { name: "Quiz results", route: "/competitions", state: {"step":"complete","selectedYear":2}, position: {"x":5760,"y":3800} },
    scr_vngbh2: { name: "Leaderboard", route: "/leaderboard", position: {"x":1400,"y":0}, isDefaultRow: true },
    scr_ztahpl: { name: "About", route: "/about", position: {"x":0,"y":0}, isDefaultRow: true },
  },
  sections: {
    sec_c9owc1: { name: "Main navigation", x: 0, y: 1600, width: 5720, height: 1180 },
    sec_978y30: { name: "Competitions quiz flow", x: 0, y: 3580, width: 5720, height: 1180 },
  },
  layers: [
    { kind: "screen", id: "scr_ztahpl" },
    { kind: "section", id: "sec_c9owc1", children: [
      { kind: "screen", id: "scr_n8cfza" },
    ] },
    { kind: "screen", id: "scr_vngbh2" },
    { kind: "section", id: "sec_978y30", children: [
      { kind: "screen", id: "scr_v2af1y" },
      { kind: "screen", id: "scr_woacsg" },
      { kind: "screen", id: "scr_c4reer" },
      { kind: "screen", id: "scr_w314tv" },
      { kind: "screen", id: "scr_e39rzb" },
    ] },
  ],
}
