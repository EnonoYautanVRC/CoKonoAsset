import { createContext, FC } from 'react'
import { usePreferenceContext } from './hook'
import { PreferenceStore } from '@/lib/bindings'
import { useTheme } from 'next-themes'
import { getDefaultPreferences } from '@/lib/utils'
import { argbFromHex, Hct, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities'
import convert from 'color-convert'

export type PreferenceContextType = {
  preference: PreferenceStore
  setPreference: (preference: PreferenceStore, save: boolean) => Promise<void>
}

export const PreferenceContext = createContext<PreferenceContextType>({
  preference: getDefaultPreferences(),
  setPreference: async () => { },
})

type Props = {
  children: React.ReactNode
}

const PreferenceContextProvider: FC<Props> = ({ children }) => {
  const { preferenceContextValue } = usePreferenceContext()
  const { setTheme } = useTheme()

  setTheme(preferenceContextValue.preference.theme)
  const theme = themeFromSourceColor(argbFromHex(preferenceContextValue.preference.themeColor), [
    {
      name: "budge-avatar",
      value: argbFromHex("#bf3f5b"),
      blend: true
    },
    {
      name: "budge-avatarWearable",
      value: argbFromHex("#facc15"),
      blend: true
    },
    {
      name: "budge-worldObject",
      value: argbFromHex("#38bdf8"),
      blend: true
    }
  ]);

  const styleElement = document.querySelector("style#Material") || document.createElement("style");
  styleElement.id = "Material";
  const lightThemes = [];
  const darkThemes = [];

  // console.debug(theme);

  for (const k in theme.schemes.light.props) {
    lightThemes.push("--" + k + ":" + convert.hex.hsl(hexFromArgb(theme.schemes.light.props[k])).join(' ') + ";");
  }
  for (const k in theme.schemes.dark.props) {
    darkThemes.push("--" + k + ":" + convert.hex.hsl(hexFromArgb(theme.schemes.dark.props[k])).join(" ") + ";");
  }
  for (const k in theme.palettes) {
    for (let i = 0; i <= 100; i++) {
      const color = Hct.from(theme.palettes[k].hue, theme.palettes[k].chroma, i).toInt();
      lightThemes.push("--" + k + "-" + i + ":" + convert.hex.hsl(hexFromArgb(color)).join(' ') + ";");
    }
  }
  theme.customColors.forEach((e) => {
    for (const k in e.light) {
      lightThemes.push("--" + e.color.name + "-" + k + ":" + convert.hex.hsl(hexFromArgb(e.light[k])).join(" ") + ";");
    }
    for (const k in e.dark) {
      darkThemes.push("--" + e.color.name + "-" + k + ":" + convert.hex.hsl(hexFromArgb(e.dark[k])).join(" ") + ";");
    }
  });

  styleElement.innerText = ":root{" + lightThemes.join("") + "}:root.dark{" + darkThemes.join("") + "}";
  document.head.append(styleElement);

  return (
    <PreferenceContext.Provider value={preferenceContextValue}>
      {children}
    </PreferenceContext.Provider>
  )
}

export default PreferenceContextProvider
