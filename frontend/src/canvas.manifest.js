export const manifest = {
  screens: {
    scr_n8cfza: { name: "Chat", route: "/", position: { "x": 160, "y": 1820 } },
    scr_62vqft: { name: "Lectures", route: "/lectures", position: { "x": 1560, "y": 1820 } },
    scr_4ev4bd: { name: "Lecturers", route: "/lecturers", position: { "x": 2960, "y": 1820 } },
    scr_4sjfna: { name: "Halls", route: "/halls", position: { "x": 4360, "y": 1820 } },
    scr_ztahpl: { name: "About", route: "/about", position: { "x": 0, "y": 0 }, isDefaultRow: true }
  },
  sections: {
    sec_c9owc1: { name: "Main navigation", x: 0, y: 1600, width: 5720, height: 1180 }
  },
  layers: [
  { kind: "screen", id: "scr_ztahpl" },
  { kind: "section", id: "sec_c9owc1", children: [
    { kind: "screen", id: "scr_n8cfza" },
    { kind: "screen", id: "scr_62vqft" },
    { kind: "screen", id: "scr_4ev4bd" },
    { kind: "screen", id: "scr_4sjfna" }]
  }]

};