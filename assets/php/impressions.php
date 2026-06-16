<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

$assetDir = dirname(__DIR__);
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$items = [];
$directories = [
    [$assetDir . '/img', 'assets/img/'],
    [$assetDir . '/img/impressions', 'assets/img/impressions/'],
];

foreach ($directories as [$imageDir, $webPrefix]) {
    if (!is_dir($imageDir)) {
        continue;
    }

    foreach (scandir($imageDir) ?: [] as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        $path = $imageDir . '/' . $file;
        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $basename = strtolower(pathinfo($file, PATHINFO_FILENAME));

        if (!is_file($path) || !in_array($extension, $allowed, true) || $basename === 'logo') {
            continue;
        }

        $items[] = [
            'src' => $webPrefix . rawurlencode($file),
            'alt' => 'Impression von Moonstep Motion',
            'modified' => filemtime($path) ?: 0,
        ];
    }
}

usort($items, static function (array $a, array $b): int {
    return $b['modified'] <=> $a['modified'];
});

echo json_encode(array_map(static function (array $item): array {
    return [
        'src' => $item['src'],
        'alt' => $item['alt'],
    ];
}, $items), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
