import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme.dart';

class LiveRoutingFeed extends StatelessWidget {
  final List<Map<String, dynamic>> events;
  final bool isConnected;

  const LiveRoutingFeed({
    super.key,
    required this.events,
    required this.isConnected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: IrisColors.white,
        border: const Border(
          bottom: BorderSide(color: IrisColors.ink, width: 4),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.analytics_outlined, color: IrisColors.ink, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Routing Brain',
                      style: GoogleFonts.spaceGrotesk(
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                        color: IrisColors.ink,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isConnected ? IrisColors.mint : IrisColors.coral,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      isConnected ? 'LIVE' : 'DISCONNECTED',
                      style: GoogleFonts.spaceGrotesk(
                        fontWeight: FontWeight.w900,
                        fontSize: 10,
                        color: IrisColors.ink,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            height: 4,
            color: IrisColors.ink,
          ),
          SizedBox(
            height: 120,
            child: events.isEmpty
                ? Center(
                    child: Text(
                      'Waiting for routing events...',
                      style: GoogleFonts.jetBrainsMono(
                        fontSize: 12,
                        color: IrisColors.ink.withValues(alpha: 0.5),
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemCount: events.length,
                    itemBuilder: (context, index) {
                      final event = events[index];
                      return _buildEventItem(event);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildEventItem(Map<String, dynamic> event) {
    final type = event['type'];
    final time = DateFormat('HH:mm:ss').format(DateTime.now());

    if (type == 'budget_update') {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              time,
              style: GoogleFonts.jetBrainsMono(
                fontSize: 10,
                color: IrisColors.ink.withValues(alpha: 0.4),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              '💰',
              style: const TextStyle(fontSize: 12),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Budget update: \$${(event['spent'] ?? 0).toStringAsFixed(2)} / \$${(event['remaining'] ?? 0).toStringAsFixed(2)} remaining',
                style: GoogleFonts.jetBrainsMono(
                  fontSize: 11,
                  color: IrisColors.ink.withValues(alpha: 0.8),
                ),
              ),
            ),
          ],
        ),
      );
    }

    final isCached = event['tier'] == 'cached';
    final modelName = event['modelDisplayName'] ?? event['modelId'];
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            time,
            style: GoogleFonts.jetBrainsMono(
              fontSize: 10,
              color: IrisColors.ink.withValues(alpha: 0.4),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            isCached ? '⚡' : '🔄',
            style: const TextStyle(fontSize: 12),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              isCached 
                  ? 'Cache hit: served instantly'
                  : 'Routed to $modelName (Complexity: ${event['complexity']})',
              style: GoogleFonts.jetBrainsMono(
                fontSize: 11,
                color: IrisColors.ink,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
