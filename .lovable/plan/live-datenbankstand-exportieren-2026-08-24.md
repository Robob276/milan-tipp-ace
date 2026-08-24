# Live-Datenbankstand exportieren

Ein Dashboard-Zugang lässt sich hier nicht vergeben: Das Backend läuft als verwaltete Lovable-Cloud-Instanz, es gibt keine externe Konsole und keine Service-Role-Zugangsdaten. Was möglich ist: Ich lese den echten Live-Zustand direkt aus der Datenbank aus und lege eine Schema-Datei ab, die dein Entwickler wie einen Dump verwenden kann.

## Was erzeugt wird

Eine Datei `schema-live.sql` (plus eine kurze Markdown-Übersicht) mit dem tatsächlichen aktuellen Stand:

- Alle Tabellen im `public`-Schema mit Spalten, Typen, Defaults, NOT-NULL
- Primär-, Fremdschlüssel-, Unique- und Check-Constraints sowie Indizes
- Enum-Typen
- RLS-Status pro Tabelle und alle Policies im Volltext
- Alle Datenbankfunktionen im Volltext (inkl. SECURITY DEFINER / search_path)
- Alle Trigger
- Tabellen-Grants für `anon`, `authenticated`, `service_role`
- Zeilenzahlen pro Tabelle (zur Plausibilitätsprüfung, keine Inhalte)

Keine Nutzerdaten, keine PIN-Hashes, keine Schlüssel – reines Schema.

## Abgleich mit dem Repo

Zusätzlich liste ich, welche Migrationsdateien in `supabase/migrations/` liegen und welche laut Datenbank tatsächlich angewendet sind, damit sichtbar wird, ob im Live-Stand etwas existiert, das nicht als Migration im Repo steht.

## Technisches

- Auslesen read-only über `information_schema`/`pg_catalog` (`pg_get_functiondef`, `pg_get_triggerdef`, `pg_policies`, `pg_indexes`, `has_table_privilege`).
- Kein `pg_dump` – Vollabzüge sind über diesen Weg nicht verfügbar. Einen echten Datenexport gibt es in Lovable unter Cloud → Advanced settings → Export data.
- Ablage der Dateien unter `/mnt/documents/`, sodass du sie herunterladen und weitergeben kannst.

## Offen

Falls zusätzlich Daten (Zeileninhalte einzelner Tabellen als CSV) gebraucht werden, sag welche Tabellen – das ergänze ich.
