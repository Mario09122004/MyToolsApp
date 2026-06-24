import React from 'react';
import { Box } from "@/components/ui/box";
// Importamos los componentes nativos de MapLibre
import MapLibreGL from '@maplibre/maplibre-react-native';

// Configuración inicial obligatoria para MapLibre (se le pasa null ya que no usamos API keys de Mapbox)
MapLibreGL.setAccessToken(null);

export const Mapadd = () => {
    const latitude = 24.0277;
    const longitude = -104.6532;

    // Configuración del estilo de OpenStreetMap en formato JSON vectorial compatible con MapLibre
    const openStreetMapStyle = {
        version: 8,
        sources: {
            'osm-tiles': {
                type: 'raster',
                tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
            },
        },
        layers: [
            {
                id: 'osm-tiles-layer',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 19,
            },
        ],
    };

    return (
        <>
            <Box className="h-full w-full">
                <MapLibreGL.MapView
                    // Le pasamos nuestro mapa open-source directo
                    styleJSON={JSON.stringify(openStreetMapStyle)}
                    className="flex-1"
                    logoEnabled={false} // Quitamos logos innecesarios
                >
                    {/* Control de la cámara y posición inicial */}
                    <MapLibreGL.Camera
                        defaultSettings={{
                            centerCoordinate: [longitude, latitude], // OJO: MapLibre usa [Longitud, Latitud] al revés de Google
                            zoomLevel: 12,
                        }}
                    />

                    {/* El puntito azul que rastrea la ubicación del usuario en tiempo real */}
                    <MapLibreGL.UserLocation
                        visible={true}
                        showsUserHeadingIndicator={true}
                    />
                </MapLibreGL.MapView>
            </Box>
        </>
    );
};