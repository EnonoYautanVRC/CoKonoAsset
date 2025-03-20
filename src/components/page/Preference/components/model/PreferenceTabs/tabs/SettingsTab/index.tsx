import { PreferenceContext } from '@/components/context/PreferenceContext'
import { PreferenceTabIDs } from '@/components/page/Preference/hook'

import { TabsContent } from '@/components/ui/tabs'
import { LanguageCode, Theme, UpdateChannel } from '@/lib/bindings'
import { FC, useContext } from 'react'
import DataDirSelector from './components/DataDirSelector'
import ResetButton from './components/ResetButton'
import { Separator } from '@/components/ui/separator'
import ThemeSelector from '@/components/model/preference/ThemeSelector'
import ThemeColorSelector from "@/components/model/preference/ThemeColorSelector"
import UseUnitypackageSelectorToggle from '@/components/model/preference/UseUnitypackageSelectorToggle'
import DeleteSourceToggle from '@/components/model/preference/DeleteSourceToggle'
import { LanguageSelector } from '@/components/model/preference/LanguageSelector'
import UpdateChannelSelector from '@/components/model/preference/UpdateChannelSelector'
import { argbFromHex, themeFromSourceColor, hexFromArgb, Hct } from "@material/material-color-utilities"
import convert from 'color-convert';
import { hexToHsva } from '@uiw/react-color'

type Props = {
  id: PreferenceTabIDs
}

const SettingsTab: FC<Props> = ({ id }) => {
  const { preference, setPreference } = useContext(PreferenceContext)

  return (
    <TabsContent value={id} className="w-full h-screen mt-0">
      <div className="w-full px-12 py-8 mt-0 space-y-8">
        <ThemeSelector
          theme={preference.theme}
          setTheme={async (theme: Theme) => {
            await setPreference({ ...preference, theme }, true)
          }}
        />
        <ThemeColorSelector
          color={hexToHsva(preference.themeColor || "#ff00ff")}
          setColor={async (color: any) => {
            await setPreference({ ...preference, themeColor: color }, true);
            const theme = themeFromSourceColor(argbFromHex(color), [
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
            console.debug(color);
            console.debug(preference.themeColor);

          }}
        />
        <DataDirSelector
          dataDir={preference.dataDirPath}
          updateLocalDataDir={async (dataDir: string) => {
            await setPreference({ ...preference, dataDirPath: dataDir }, false)
          }}
        />
        <UseUnitypackageSelectorToggle
          enable={preference.useUnitypackageSelectedOpen}
          setEnable={async (enable: boolean) => {
            await setPreference(
              {
                ...preference,
                useUnitypackageSelectedOpen: enable,
              },
              true,
            )
          }}
        />
        <DeleteSourceToggle
          enable={preference.deleteOnImport}
          setEnable={async (enable: boolean) => {
            await setPreference(
              {
                ...preference,
                deleteOnImport: enable,
              },
              true,
            )
          }}
        />
        <Separator />
        <LanguageSelector
          language={preference.language}
          setLanguage={async (language: LanguageCode) => {
            await setPreference({ ...preference, language }, true)
          }}
        />
        <UpdateChannelSelector
          updateChannel={preference.updateChannel}
          setUpdateChannel={async (channel: UpdateChannel) => {
            await setPreference({ ...preference, updateChannel: channel }, true)
          }}
        />
        <ResetButton />
      </div>
    </TabsContent>
  )
}

export default SettingsTab
